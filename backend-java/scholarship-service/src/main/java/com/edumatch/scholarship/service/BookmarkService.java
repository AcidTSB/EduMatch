package com.edumatch.scholarship.service;

import com.edumatch.scholarship.dto.BookmarkDto;
import com.edumatch.scholarship.dto.client.UserDetailDto;
import com.edumatch.scholarship.exception.ResourceNotFoundException;
import com.edumatch.scholarship.model.Bookmark;
import com.edumatch.scholarship.model.Opportunity;
import com.edumatch.scholarship.repository.BookmarkRepository;
import com.edumatch.scholarship.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final OpportunityRepository opportunityRepository; // Cần để lấy thông tin opp
    private final ScholarshipService scholarshipService; // Cần để lấy User ID

    /**
     * Chức năng: Thêm hoặc xóa (Toggle) một bookmark
     * Trả về true nếu là "Đã thêm", false nếu là "Đã xóa"
     */
    public boolean toggleBookmark(Long opportunityId, UserDetails userDetails) {
        // 1. Lấy thông tin user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        UserDetailDto user = scholarshipService.getUserDetailsFromAuthService(userDetails.getUsername(), token);
        Long applicantId = user.getId();

        // 2. Kiểm tra xem đã bookmark chưa
        var existingBookmark = bookmarkRepository
                .findByApplicantUserIdAndOpportunityId(applicantId, opportunityId);

        if (existingBookmark.isPresent()) {
            // 3. Nếu đã có -> Xóa
            bookmarkRepository.delete(existingBookmark.get());
            log.info("User {} đã XÓA bookmark cho cơ hội {}", applicantId, opportunityId);
            return false; // Đã xóa
        } else {
            // 4. Nếu chưa có -> Tạo mới
            // (Kiểm tra xem opp có tồn tại không)
            if (!opportunityRepository.existsById(opportunityId)) {
                throw new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId);
            }

            Bookmark newBookmark = new Bookmark();
            newBookmark.setApplicantUserId(applicantId);
            newBookmark.setOpportunityId(opportunityId);
            bookmarkRepository.save(newBookmark);

            log.info("User {} đã THÊM bookmark cho cơ hội {}", applicantId, opportunityId);
            return true; // Đã thêm
        }
    }

    /**
     * Chức năng: Lấy tất cả bookmark của tôi
     */
    public List<BookmarkDto> getMyBookmarks(UserDetails userDetails) {
        // 1. Lấy thông tin user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        UserDetailDto user = scholarshipService.getUserDetailsFromAuthService(userDetails.getUsername(), token);
        Long applicantId = user.getId();

        // 2. Lấy danh sách bookmark
        List<Bookmark> bookmarks = bookmarkRepository.findByApplicantUserId(applicantId);

        // 3. Chuyển đổi sang DTO (cần lấy thông tin Opportunity)
        return bookmarks.stream()
                .map(bookmark -> {
                    // Lấy thông tin chi tiết của Opportunity
                    Opportunity opp = opportunityRepository.findById(bookmark.getOpportunityId())
                            .orElse(null); // (Nên xử lý nếu opp bị xóa)

                    if (opp == null) return null;

                    return BookmarkDto.fromEntity(bookmark, opp);
                })
                .filter(dto -> dto != null) // Lọc ra những bookmark trỏ đến opp đã bị xóa
                .collect(Collectors.toList());
    }
}