package com.edumatch.scholarship.repository.specification;

import com.edumatch.scholarship.model.Opportunity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OpportunitySpecification {

    public static Specification<Opportunity> filterBy(
            String keyword, // Tham số ?q=
            BigDecimal gpa // Tham số ?gpa=
            // (Bạn có thể thêm các tham số khác như position, country ở đây)
    ) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // 1. ĐIỀU KIỆN BẮT BUỘC: Chỉ lấy các cơ hội đã được duyệt
            predicates.add(criteriaBuilder.equal(root.get("moderationStatus"), "APPROVED"));

            // 2. Lọc theo Keyword (nếu có)
            if (keyword != null && !keyword.isEmpty()) {
                String keywordLike = "%" + keyword.toLowerCase() + "%";
                // Tìm trong title HOẶC description
                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keywordLike),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("fullDescription")), keywordLike)
                        )
                );
            }

            // 3. Lọc theo GPA (nếu có)
            // Tìm các cơ hội yêu cầu GPA <= GPA của user
            if (gpa != null) {
                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.lessThanOrEqualTo(root.get("minGpa"), gpa),
                                criteriaBuilder.isNull(root.get("minGpa")) // Lấy cả các cơ hội không yêu cầu GPA
                        )
                );
            }

            // Kết hợp tất cả lại bằng AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}