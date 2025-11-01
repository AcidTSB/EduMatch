package com.edumatch.rabbitmq.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthProducer {

    private final RabbitTemplate rabbitTemplate;

    public AuthProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendUserCreatedEvent(String message) {
        rabbitTemplate.convertAndSend("exchange", "routingkey", message);
        System.out.println("📤 Sent message: " + message);
    }
}
