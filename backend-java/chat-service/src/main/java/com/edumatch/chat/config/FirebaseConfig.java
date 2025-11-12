package com.edumatch.chat.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    // Lấy đường dẫn file JSON từ application.properties
    @Value("${app.firebase.sdk-path}")
    private String firebaseSdkPath;

    private final ResourceLoader resourceLoader;

    // Spring tự động tiêm ResourceLoader
    public FirebaseConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        log.info("Bắt đầu khởi tạo Firebase Admin SDK...");

        Resource resource = resourceLoader.getResource(firebaseSdkPath);

        try (InputStream serviceAccount = resource.getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                log.info("Firebase Admin SDK khởi tạo thành công.");
                return FirebaseApp.initializeApp(options);
            }
            log.warn("Firebase App đã được khởi tạo trước đó.");
            return FirebaseApp.getInstance();

        } catch (IOException e) {
            log.error("Lỗi khởi tạo Firebase Admin SDK. Kiểm tra đường dẫn: {}", firebaseSdkPath, e);
            throw e;
        }
    }
}