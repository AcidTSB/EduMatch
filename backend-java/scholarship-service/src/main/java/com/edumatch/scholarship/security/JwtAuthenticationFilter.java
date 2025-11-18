package com.edumatch.scholarship.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Đánh dấu là 1 Bean
@RequiredArgsConstructor // Tự động tiêm (inject) các biến final
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Value("${app.jwt.header}")
    private String headerName;

    @Value("${app.jwt.prefix}")
    private String headerPrefix;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. Lấy JWT từ request
            String bearerToken = request.getHeader(headerName);
            String jwt = getJwtFromRequest(request);
            
            log.debug("JWT Filter - URI: {}, Header '{}': {}", 
                request.getRequestURI(), headerName, bearerToken != null ? "present" : "missing");
            if (bearerToken != null) {
                log.debug("JWT Filter - Bearer token length: {}", bearerToken.length());
            }
            log.debug("JWT Filter - Extracted JWT: {}", jwt != null ? jwt.substring(0, Math.min(20, jwt.length())) + "..." : "null");

            // 2. Xác thực token
            if (StringUtils.hasText(jwt)) {
                boolean isValid = tokenProvider.validateToken(jwt);
                log.debug("JWT Filter - Token validation result: {}", isValid);
                
                if (isValid) {
                    try {
                        // 3. Lấy thông tin user (username, roles)
                        Authentication authentication = tokenProvider.getAuthentication(jwt);
                        log.debug("JWT Filter - Authentication successful for user: {}, authorities: {}", 
                            authentication.getName(), 
                            authentication.getAuthorities());
                        
                        // 4. Lưu vào SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } catch (Exception ex) {
                        log.error("JWT Filter - Error getting authentication from token: {}", ex.getMessage(), ex);
                    }
                } else {
                    log.warn("JWT Filter - Token validation failed for URI: {}", request.getRequestURI());
                }
            } else {
                log.debug("JWT Filter - Token missing or empty for URI: {}", request.getRequestURI());
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        // Chuyển request đi tiếp
        filterChain.doFilter(request, response);
    }

    // Hàm helper để trích xuất token từ "Bearer <token>"
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(headerName);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(headerPrefix + " ")) {
            return bearerToken.substring(headerPrefix.length() + 1);
        }
        return null;
    }
}
