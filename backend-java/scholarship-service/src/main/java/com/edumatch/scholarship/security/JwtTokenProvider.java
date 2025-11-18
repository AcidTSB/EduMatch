package com.edumatch.scholarship.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        // Khởi tạo key mã hóa từ file properties
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Hàm này giải mã token và lấy ra thông tin Authentication
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String username = claims.getSubject();
        Object rolesClaim = claims.get("roles");
        log.debug("JWT Token - Subject: {}, Roles claim: {} (type: {})", 
            username, rolesClaim, rolesClaim != null ? rolesClaim.getClass().getSimpleName() : "null");

        // Lấy danh sách quyền (roles) từ token
        String rolesString = rolesClaim != null ? rolesClaim.toString() : "";
        log.debug("JWT Token - Roles string: '{}'", rolesString);
        
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(rolesString.split(","))
                        .filter(auth -> !auth.trim().isEmpty())
                        .map(role -> {
                            log.debug("JWT Token - Creating authority: '{}'", role.trim());
                            return new SimpleGrantedAuthority(role.trim());
                        })
                        .collect(Collectors.toList());

        log.debug("JWT Token - Final authorities: {}", authorities);

        // Tạo một đối tượng UserDetails (principal) từ thông tin token
        // Chúng ta không cần mật khẩu ở đây
        UserDetails principal = new User(username, "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    // Hàm này kiểm tra xem token có hợp lệ không (còn hạn, đúng chữ ký)
    public boolean validateToken(String authToken) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(authToken).getPayload();
            log.debug("JWT Token validated successfully. Subject: {}, Expiration: {}, Roles: {}", 
                claims.getSubject(), claims.getExpiration(), claims.get("roles"));
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: expired at {}", ex.getClaims().getExpiration());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (Exception ex) {
            log.error("Unexpected error validating JWT token: {}", ex.getMessage(), ex);
        }
        return false;
    }
}
