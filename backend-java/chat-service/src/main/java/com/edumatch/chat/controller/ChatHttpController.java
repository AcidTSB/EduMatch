package com.edumatch.chat.controller;

import com.edumatch.chat.dto.ApiResponse;
import com.edumatch.chat.dto.ConversationDto;
import com.edumatch.chat.dto.FcmRegisterRequest;
import com.edumatch.chat.model.Message;
import com.edumatch.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Tiền tố chung cho các API
@RequiredArgsConstructor
public class ChatHttpController {

    private final ChatService chatService;

    /**
     * API: POST /api/fcm/register
     */
    @PostMapping("/fcm/register")
    public ResponseEntity<ApiResponse> registerFcmToken(
            @Valid @RequestBody FcmRegisterRequest request,
            Authentication authentication) {

        chatService.registerFcmToken(request, authentication);
        return ResponseEntity.ok(new ApiResponse(true, "Token đã được đăng ký thành công"));
    }

    /**
     * API: GET /api/conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(Authentication authentication) {

        List<ConversationDto> conversations = chatService.getConversations(authentication);
        return ResponseEntity.ok(conversations);
    }

    /**
     * API: GET /api/messages/{conversationId}
     * (Khớp yêu cầu [cite: 391])
     */
    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<Page<Message>> getMessages(
            @PathVariable Long conversationId,
            Pageable pageable, // Spring tự động điền (vd: ?page=0&size=20)
            Authentication authentication) {

        Page<Message> messages = chatService.getMessagesForConversation(
                conversationId, pageable, authentication
        );
        return ResponseEntity.ok(messages);
    }
}