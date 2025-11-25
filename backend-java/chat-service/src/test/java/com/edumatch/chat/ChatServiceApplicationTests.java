package com.edumatch.chat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@EnableAutoConfiguration(exclude = RabbitAutoConfiguration.class)
@ActiveProfiles("test")
class ChatServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
