package com.edumatch.getway.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${auth.service.url:http://localhost:8081}")
    private String authServiceUrl; // ví dụ: http://localhost:8081

    /**
     * Gọi service-auth-java để verify token.
     * Trả về true nếu token hợp lệ.
     */
    public boolean verifyToken(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return false;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", bearerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String verifyEndpoint = authServiceUrl + "/auth/verify"; // chỉnh nếu khác

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    verifyEndpoint,
                    HttpMethod.POST,
                    entity,
                    Void.class
            );

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            // Log nếu cần
            return false;
        }
    }
}

