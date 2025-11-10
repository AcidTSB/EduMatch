package com.edumatch.scholarship.config;

import com.edumatch.scholarship.security.JwtAuthenticationEntryPoint;
import com.edumatch.scholarship.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Bật @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF
                .csrf(AbstractHttpConfigurer::disable)
                // Báo lỗi 401 khi user chưa xác thực

                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))

                // Không lưu session (vì dùng JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Định nghĩa các luật truy cập
                .authorizeHttpRequests(auth -> auth
                        // --- DEBUG ENDPOINTS ---
                        .requestMatchers("/debug/**").permitAll()
                        // --- API Public (Không cần đăng nhập) ---
                        // Cho phép xem (GET) danh sách và chi tiết học bổng
                        .requestMatchers(HttpMethod.GET, "/api/scholarships").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/scholarships/**").permitAll()
                        // --- API CHO PROVIDER (ROLE_EMPLOYER) ---
                        .requestMatchers(HttpMethod.POST, "/api/opportunities").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.GET, "/api/opportunities/my").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.PUT, "/api/opportunities/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.DELETE, "/api/opportunities/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.GET, "/api/applications/opportunity/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.PUT, "/api/applications/*/status").hasRole("EMPLOYER")
                        // --- API CHO APPLICANT (ROLE_USER) ---
                        .requestMatchers(HttpMethod.POST, "/api/bookmarks/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/bookmarks/my").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/applications/my").hasRole("USER")
                        // --- API CHO ADMIN ---
                        .requestMatchers(HttpMethod.GET, "/api/opportunities/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/opportunities/**/moderate").hasRole("ADMIN")
                        // Yêu cầu xác thực cho tất cả các API còn lại
                        .anyRequest().authenticated()
                );

        // Thêm bộ lọc JWT vào trước bộ lọc mặc định
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
