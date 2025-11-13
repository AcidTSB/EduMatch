package com.edumatch.chat.service;

import com.edumatch.chat.dto.ChatMessageRequest;
import com.edumatch.chat.dto.ConversationDto;
import com.edumatch.chat.dto.FcmRegisterRequest;
import com.edumatch.chat.model.FcmToken;
import com.edumatch.chat.dto.UserDetailDto;
import com.edumatch.chat.model.Conversation;
import com.edumatch.chat.model.Message;
import com.edumatch.chat.repository.ConversationRepository;
import com.edumatch.chat.repository.FcmTokenRepository;
import com.edumatch.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.edumatch.chat.dto.UserDetailDto;
import com.edumatch.chat.model.Notification;
import com.edumatch.chat.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final FcmTokenRepository fcmTokenRepository;
    private final NotificationRepository notificationRepository;
    private final RestTemplate restTemplate;

    @Value("${app.services.auth-service.url:http://auth-service:8081}") // Lấy URL từ properties
    private String authServiceUrl;

    /**
     * Xử lý và lưu tin nhắn mới
     */
    @Transactional
    public Message saveAndProcessMessage(ChatMessageRequest request, Authentication authentication) {
        // 1. Lấy thông tin người gửi (Sender)
        // Lấy username và token từ Authentication (đã được Interceptor xác thực)
        String username = authentication.getName();
        String token = (String) authentication.getCredentials();

        // Gọi Auth-Service để lấy ID (Long) của người gửi
        UserDetailDto sender = getUserDetailsFromAuthService(username, token);
        Long senderId = sender.getId();
        Long receiverId = request.getReceiverId();

        // 2. Tìm hoặc Tạo cuộc hội thoại (Conversation)
        Conversation conversation = findOrCreateConversation(senderId, receiverId);

        // 3. Tạo và Lưu tin nhắn (Message)
        Message message = Message.builder()
                .conversationId(conversation.getId())
                .senderId(senderId)
                .content(request.getContent())
                // sentAt được tự động điền bởi @CreationTimestamp
                .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Đã lưu tin nhắn mới (ID: {}) vào cuộc hội thoại (ID: {})",
                savedMessage.getId(), conversation.getId());

        return savedMessage;
    }

    /**
     * Tìm cuộc hội thoại giữa 2 người, nếu không có thì tạo mới.
     */
    private Conversation findOrCreateConversation(Long senderId, Long receiverId) {
        return conversationRepository.findByParticipants(senderId, receiverId)
                .map(conv -> {
                    // Nếu tìm thấy, cập nhật thời gian
                    conv.setLastMessageAt(LocalDateTime.now());
                    return conversationRepository.save(conv);
                })
                .orElseGet(() -> {
                    // Nếu không tìm thấy, tạo mới
                    Conversation newConv = Conversation.builder()
                            .participant1Id(senderId)
                            .participant2Id(receiverId)
                            .lastMessageAt(LocalDateTime.now())
                            .build();
                    log.info("Tạo cuộc hội thoại mới giữa User {} và User {}", senderId, receiverId);
                    return conversationRepository.save(newConv);
                });
    }
    /**
     * (Logic cho API: POST /api/fcm/register)
     * Đăng ký hoặc cập nhật FCM token cho user
     */
    @Transactional
    public void registerFcmToken(FcmRegisterRequest request, Authentication authentication) {
        // 1. Lấy UserID (Long)
        UserDetailDto user = getUserDetailsFromAuthService(
                authentication.getName(),
                (String) authentication.getCredentials()
        );
        Long userId = user.getId();

        // 2. Tìm token cũ (nếu có)
        FcmToken token = fcmTokenRepository.findByUserId(userId)
                .orElse(new FcmToken()); // Nếu không có, tạo mới

        // 3. Cập nhật
        token.setUserId(userId);
        token.setDeviceToken(request.getFcmToken());
        fcmTokenRepository.save(token);
        log.info("Đã cập nhật FCM token cho User {}", userId);
    }

    /**
     * (Logic cho API: GET /api/conversations)
     * Lấy danh sách cuộc hội thoại của user
     */
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(Authentication authentication) {
        // 1. Lấy UserID (Long)
        UserDetailDto user = getUserDetailsFromAuthService(
                authentication.getName(),
                (String) authentication.getCredentials()
        );
        Long currentUserId = user.getId();

        // 2. Lấy danh sách Entity
        List<Conversation> conversations = conversationRepository.findByParticipantId(currentUserId);

        // 3. Chuyển đổi sang DTO
        return conversations.stream()
                .map(conv -> ConversationDto.fromEntity(conv, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * (Logic cho API: GET /api/messages/{conversationId})
     * Lấy lịch sử tin nhắn (phân trang)
     */
    @Transactional(readOnly = true)
    public Page<Message> getMessagesForConversation(Long conversationId, Pageable pageable, Authentication authentication) {
        // 1. Lấy UserID (Long)
        UserDetailDto user = getUserDetailsFromAuthService(
                authentication.getName(),
                (String) authentication.getCredentials()
        );
        Long currentUserId = user.getId();

        // 2. Kiểm tra quyền
        // (User phải là 1 trong 2 người tham gia hội thoại)
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hội thoại"));

        if (!conversation.getParticipant1Id().equals(currentUserId) &&
                !conversation.getParticipant2Id().equals(currentUserId)) {
            log.warn("User {} cố gắng truy cập trái phép vào cuộc hội thoại {}",
                    currentUserId, conversationId);
            throw new AccessDeniedException("Bạn không có quyền xem cuộc hội thoại này");
        }

        // 3. Lấy dữ liệu (phân trang)
        // (Chúng ta trả về Page<Message> (Entity) vì MessageDto gần như giống hệt Message Entity)
        return messageRepository.findByConversationIdOrderBySentAtDesc(conversationId, pageable);
    }

    /**
     * Hàm helper gọi sang Auth-Service để lấy UserID (Long) từ Username (String).
     */
    private UserDetailDto getUserDetailsFromAuthService(String username, String token) {
        String url = authServiceUrl + "/api/internal/user/" + username;
        log.info("ChatService: Calling Auth-Service to get user details for: {}", username);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<UserDetailDto> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, UserDetailDto.class
            );
            UserDetailDto user = response.getBody();
            if (user == null || user.getId() == null) {
                throw new RuntimeException("Không thể lấy thông tin (ID) user từ Auth-Service.");
            }
            log.info("ChatService: Successfully received user details, userId={}", user.getId());
            return user;
        } catch (Exception ex) {
            log.error("Lỗi khi gọi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Không thể kết nối hoặc xác thực với Auth-Service.");
        }
    }
    /**
     * (Logic cho API: GET /api/notifications)
     * Lấy danh sách thông báo đã lưu trong DB của user
     */
    @Transactional(readOnly = true)
    public Page<Notification> getMyNotifications(Pageable pageable, Authentication authentication) {
        // 1. Lấy UserID (Long)
        UserDetailDto user = getUserDetailsFromAuthService(
                authentication.getName(),
                (String) authentication.getCredentials()
        );
        Long currentUserId = user.getId();

        // 2. Lấy dữ liệu (đã được sắp xếp và phân trang)
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUserId, pageable);
    }

    /**
     * (Logic cho API: PATCH /api/notifications/{id}/read)
     * Đánh dấu thông báo là đã đọc
     */
    @Transactional
    public void markNotificationAsRead(Long notificationId, Authentication authentication) {
        // 1. Lấy UserID (Long)
        UserDetailDto user = getUserDetailsFromAuthService(
                authentication.getName(),
                (String) authentication.getCredentials()
        );
        Long currentUserId = user.getId();

        // 2. Tìm thông báo
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + notificationId));

        // 3. Kiểm tra quyền sở hữu (Bắt buộc)
        if (!notification.getUserId().equals(currentUserId)) {
            log.warn("User {} cố gắng đánh dấu thông báo {} của người khác là đã đọc.",
                    currentUserId, notificationId);
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa thông báo này.");
        }

        // 4. Đánh dấu đã đọc và lưu
        notification.setRead(true);
        notificationRepository.save(notification);
        log.info("Notification {} của User {} đã được đánh dấu là đã đọc.", notificationId, currentUserId);
    }
}
