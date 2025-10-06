package com.edumatch.user.controller;


import com.edumatch.user.dtos.*;
import com.edumatch.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterDto dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginDto dto) {
        return authService.login(dto);
    }
}
