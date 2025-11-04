package com.edumatch.getway.controller;

import com.edumatch.getway.service.AuthService;
import com.edumatch.getway.service.ProxyService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

/**
 * Simple gateway controller that:
 * - chọn target base URL theo đường dẫn (configurable)
 * - verify token nếu route yêu cầu
 * - forward request và trả response nguyên bản
 */
@RestController
public class GatewayController {

    private final ProxyService proxy;
    private final AuthService authService;

    // mapping route prefix -> upstream base url, cấu hình trong application.properties
    // ví dụ: /auth/**=http://localhost:8081,/user/**=http://localhost:8082
    @Value("${gateway.routes.mapping:/auth/**=http://localhost:8081,/user/**=http://localhost:8082}")
    private String rawMappings;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final Map<String, String> mappings;

    public GatewayController(ProxyService proxy, AuthService authService) {
        this.proxy = proxy;
        this.authService = authService;
        // parse mappings once from rawMappings
        this.mappings = parseMappings(rawMappings);
    }

    private Map<String, String> parseMappings(String raw) {
        // simple parser: entries separated by ','; each entry is pattern=baseUrl
        return java.util.Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> s.contains("="))
                .map(s -> s.split("=", 2))
                .collect(java.util.stream.Collectors.toMap(a -> a[0], a -> a[1]));
    }

    // Catch-all for any path
    @RequestMapping("/**")
    public ResponseEntity<byte[]> handleAll(HttpServletRequest request) throws IOException {
        String path = request.getRequestURI(); // ex: /auth/login or /user/profile
        String query = request.getQueryString();
        String fullPath = path + (query == null ? "" : "?" + query);

        // Health and any public endpoints bypass proxy auth (you can change rules)
        if (path.startsWith("/health") || path.startsWith("/public")) {
            String target = findTargetFor(path);
            if (target == null) {
                return ResponseEntity.notFound().build();
            }
            String targetUrl = buildTargetUrl(target, path, query);
            return proxy.forward(targetUrl, request);
        }

        // else: route may need auth
        String authHeader = request.getHeader("Authorization");
        boolean valid = authService.verifyToken(authHeader);
        if (!valid) {
            return ResponseEntity.status(401).body("Unauthorized".getBytes());
        }

        String target = findTargetFor(path);
        if (target == null) {
            return ResponseEntity.notFound().build();
        }
        String targetUrl = buildTargetUrl(target, path, query);
        return proxy.forward(targetUrl, request);
    }

    private String buildTargetUrl(String base, String path, String query) {
        // base already includes scheme+host+optional base path, append the path (without leading slash duplication)
        String normalizedBase = base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
        return normalizedBase + path + (query == null ? "" : "?" + query);
    }

    private String findTargetFor(String path) {
        // find first mapping whose pattern matches the path
        for (Map.Entry<String, String> e : mappings.entrySet()) {
            String pattern = e.getKey();
            if (pathMatcher.match(pattern, path)) {
                return e.getValue();
            }
        }
        return null;
    }
}