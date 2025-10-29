package com.edumatch.user.service;

import com.edumatch.user.dto.ApplicantProfileDto;
import com.edumatch.user.dto.UpdateApplicantProfileRequest;
import com.edumatch.user.dto.UserCreationRequest;
import com.edumatch.user.exception.ResourceNotFoundException;
import com.edumatch.user.model.ApplicantProfile;
import com.edumatch.user.model.Role;
import com.edumatch.user.model.User;
import com.edumatch.user.repository.ApplicantProfileRepository;
import com.edumatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.edumatch.user.dto.UserDetailDto;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicantProfileRepository applicantProfileRepository;

    /**
     * Tạo một người dùng mới cùng với hồ sơ tương ứng.
     * Thường được gọi bởi Auth-Service sau khi đăng ký thành công.
     */
    @Transactional
    public User createUser(UserCreationRequest request) {
        if (userRepository.existsById(request.getId())) {
            throw new IllegalArgumentException("User with ID " + request.getId() + " already exists.");
        }
        User newUser = User.builder()
                .id(request.getId())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(request.getRole())
                .build();

        // Nếu là Applicant (ROLE_USER), tạo sẵn một profile trống
        if (request.getRole() == Role.ROLE_USER) {
            ApplicantProfile newProfile = ApplicantProfile.builder()
                    .user(newUser)
                    .build();
            newUser.setApplicantProfile(newProfile);
        }
        return userRepository.save(newUser);
    }

    /**
     * Tìm kiếm một người dùng dựa trên email của họ.
     */
    @Transactional(readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    /**
     * Lấy thông tin chi tiết hồ sơ của một ứng viên.
     */
    @Transactional(readOnly = true)
    public ApplicantProfileDto getApplicantProfile(Long userId) {
        ApplicantProfile profile = applicantProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantProfile", "userId", userId));
        return ApplicantProfileDto.fromEntity(profile);
    }

    /**
     * Cập nhật thông tin hồ sơ cho người dùng đang đăng nhập.
     */
    @Transactional
    public ApplicantProfileDto updateApplicantProfile(String userEmail, UpdateApplicantProfileRequest request) {
        User user = findUserByEmail(userEmail);
        ApplicantProfile profile = applicantProfileRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantProfile", "userId", user.getId()));

        // Cập nhật thông tin
        profile.setHeadline(request.getHeadline());
        profile.setDegreeLevel(request.getDegreeLevel());
        profile.setGpa(request.getGpa());
        profile.setInstitution(request.getInstitution());
        profile.setCountry(request.getCountry());
        profile.setResearchInterests(request.getResearchInterests());
        ApplicantProfile updatedProfile = applicantProfileRepository.save(profile);
        return ApplicantProfileDto.fromEntity(updatedProfile);
    }
    @Transactional(readOnly = true)
    public UserDetailDto findUserDetailByEmail(String email) {
        User user = findUserByEmail(email);
        return UserDetailDto.fromEntity(user);
    }

}