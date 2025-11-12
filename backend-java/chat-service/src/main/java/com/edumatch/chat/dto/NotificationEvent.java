package com.edumatch.chat.dto;

import lombok.Data;
import java.util.Optional;

/**
 * DTO đại diện cho dữ liệu Event gửi đến từ RabbitMQ.
 * Cần đủ trường để xử lý cả event Application Status và event New Match.
 */
@Data
public class NotificationEvent {
    // Thông tin người nhận
    private Long applicantUserId; // Từ ScholarshipService hoặc MatchingService
    private Long userId; // Dùng để fallback nếu applicantUserId không có

    // Nội dung thông báo
    private String title;
    private String body;
    private String status; // Ví dụ: "APPROVED" (Từ Application Status)

    // Thông tin tham chiếu
    private String opportunityId; // Từ MatchingService (New Match)
    private Long applicationId; // Từ ScholarshipService (Status Change)

    // Logic: Lấy ID người nhận cuối cùng
    public Long getRecipientId() {
        return Optional.ofNullable(applicantUserId)
                .orElse(userId);
    }
}