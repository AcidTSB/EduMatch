package com.edumatch.chat.service;

import com.edumatch.chat.model.FcmToken;
import com.edumatch.chat.repository.FcmTokenRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseMessagingService {

    private final FcmTokenRepository fcmTokenRepository; // Cần để tìm device token

    /**
     * Gửi Push Notification đến một UserID cụ thể
     */
    public void sendNotification(Long userId, String title, String body, String type, String referenceId) {
        // 1. Lấy device token của người dùng từ CSDL
        Optional<FcmToken> fcmTokenOptional = fcmTokenRepository.findByUserId(userId);

        if (fcmTokenOptional.isEmpty()) {
            log.warn("⚠️ Không tìm thấy FCM token cho User ID: {}. Không gửi push notification.", userId);
            return;
        }

        String token = fcmTokenOptional.get().getDeviceToken();

        // 2. Xây dựng nội dung thông báo
        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                // Thêm dữ liệu tùy chỉnh (payload)
                .putData("type", type)
                .putData("referenceId", referenceId != null ? referenceId : "")
                .setToken(token)
                .build();

        // 3. Gửi
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Gửi FCM thành công đến User {} (Response: {})", userId, response);
        } catch (FirebaseMessagingException e) {
            log.error("Lỗi khi gửi FCM đến User {}: {}", userId, e.getMessage(), e);
            // Có thể xóa token nếu lỗi là NOT_REGISTERED
        }
    }
}