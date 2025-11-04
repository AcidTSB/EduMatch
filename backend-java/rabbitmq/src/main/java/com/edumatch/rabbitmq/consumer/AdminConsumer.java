package com.edumatch.rabbitmq.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class AdminConsumer {

    @RabbitListener(queues = "queue")
    public void receiveMessage(String message) {
        System.out.println("📥 Received from auth-service: " + message);
        // Tại đây có thể lưu vào DB riêng của admin-service nếu cần
    }
}
