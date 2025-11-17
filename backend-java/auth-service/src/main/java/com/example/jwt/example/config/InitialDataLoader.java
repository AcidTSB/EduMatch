package com.example.jwt.example.config;

import com.example.jwt.example.model.Role;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.RoleRepository;
import com.example.jwt.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class InitialDataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Create roles if they don't exist
        createRoleIfNotFound("ROLE_USER", "Regular user role");
        createRoleIfNotFound("ROLE_EMPLOYER", "Employer role ");
        createRoleIfNotFound("ROLE_ADMIN", "Administrator role");

        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin") && !userRepository.existsByEmail("admin@example.com")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: User Role not found."));
            Role emloyerRole = roleRepository.findByName("ROLE_EMPLOYER")
                    .orElseThrow(() -> new RuntimeException("Error: User Role not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);
            roles.add(emloyerRole);

            User adminUser = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@example.com")
                    .firstName("Admin")
                    .lastName("User")
                    .roles(roles)
                    .enabled(true)
                    .status("ACTIVE")
                    .subscriptionType("FREE")
                    .build();

            userRepository.save(adminUser);
        }
    }

    private void createRoleIfNotFound(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            roleRepository.save(role);
        }
    }
}
