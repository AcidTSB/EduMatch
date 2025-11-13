package com.edumatch.chat.service;

import com.edumatch.chat.config.RabbitMQConfig;
import com.edumatch.chat.dto.NotificationEvent;
import com.edumatch.chat.model.Notification;
import com.edumatch.chat.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository notificationRepository;
    private final FirebaseMessagingService firebaseMessagingService;

    /**
     * Lắng nghe Queue "notification_queue"
     */
    // THAY THẾ TOÀN BỘ PHƯƠNG THỨC handleNotificationEvent bằng code sau:

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    @Transactional
    public void handleNotificationEvent(NotificationEvent event) {
        Long recipientId = event.getRecipientId();

        if (recipientId == null) {
            log.error("❌ Bỏ qua Event: Không xác định được ID người nhận.");
            return;
        }

        log.info("📨 Event nhận được cho User {}. Bắt đầu xử lý Notification.", recipientId);

        // Xử lý logic và tạo nội dung
        String type = "GENERAL";
        String title = "Cập nhật từ EduMatch"; // <--- GIÁ TRỊ MẶC ĐỊNH AN TOÀN
        String body = "Bạn có thông báo mới."; // <--- GIÁ TRỊ MẶC ĐỊNH AN TOÀN
        String referenceId = null;

        // Đảm bảo lấy giá trị từ event nếu có, nếu không giữ lại giá trị mặc định
        title = Optional.ofNullable(event.getTitle()).orElse(title);
        body = Optional.ofNullable(event.getBody()).orElse(body);

        if (event.getApplicationId() != null) { // Event từ ScholarshipService (Application Status Changed)
            type = "APPLICATION_STATUS";
            // Sử dụng event.status để tạo title cụ thể
            title = String.format("Cập nhật đơn: %s", event.getStatus());
            referenceId = event.getApplicationId().toString();
        } else if (event.getOpportunityId() != null) { // Event từ MatchingService (New Match)
            type = "NEW_MATCH";
            title = "🎯 Cơ hội mới phù hợp với bạn!";
            referenceId = event.getOpportunityId();
        }

        // 2. Lưu vào CSDL (để user xem lại trong API)
        Notification notification = Notification.builder()
                .userId(recipientId)
                .title(title) // <--- ĐẢM BẢO KHÔNG NULL
                .body(body)
                .type(type)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        log.info("✅ Đã lưu Notification ID: {} cho User {}", notification.getId(), recipientId);

        // 3. Gửi Push Notification (FCM)
        firebaseMessagingService.sendNotification(
                recipientId,
                title,
                body,
                type,
                referenceId
        );
    }
}