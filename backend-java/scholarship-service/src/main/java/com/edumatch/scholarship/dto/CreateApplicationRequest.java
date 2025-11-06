package com.edumatch.scholarship.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateApplicationRequest {
    @NotNull(message = "ID cơ hội là bắt buộc")
    private Long opportunityId;

    // Danh sách các tài liệu đính kèm (CV, v.v.)
    private List<ApplicationDocumentDto> documents;
}