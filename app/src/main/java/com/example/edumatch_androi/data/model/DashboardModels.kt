package com.example.edumatch_androi.data.model

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
//import androidx.datastore.preferences.protobuf.Type

data class ApplicationStat (
    val title: String,
    val count: Int,
    val change: Int, //Số thay đổi (ví dụ: so với tháng trước)
    val color: Color, //màu sắc của icons/số thay đổi
    val icon: ImageVector //icons
)

// dũ liệu cho mục học bổng đề xuất
data class Fellowship(
    val id: String,
    val title: String,
    val institution: String,
    val location: String,
    val matchPercentage: Int, // phần trăm match
    val tags: List<String>,
    val stipend: String, // ví dụ: "$75000"
    val type: String, // Ví dụ: "PhD", "Graduate"
    val deadline: String, // Ví dụ: "Expired", "12/12/2024"
    val description: String,
    val canApply: Boolean = false, // Xác định nút Apply Now hay Deadline Passed
)

// Dữ liệu cho mục thông báo
data class Notification(
    val title: String,
    val detail: String,
    val date: String,
    val isAccepted: Boolean = false, // Dùng để quyết định màu nền/icon (vd: xanh lá cho Accepted)
    val isImportant: Boolean = false // Ví dụ: màu đỏ cho Deadline Reminder
)

data class Application(
    val id: String,
    val title: String, // Tên học bổng đã ứng tuyển
    val university: String, // Tên trường
    val status: String // Trạng thái: "Pending", "Accepted", "Rejected"
)

// THÊM USER MODEL ĐỂ QUẢN LÝ DỮ LIỆU USER THẬT
data class CurrentUser(
    val uid: String,
    val displayName: String, // Tên để hiển thị (ví dụ: John Doe)
    val userEmail: String,
    val role: String, // Ví dụ: "Student"
)

// 1. Data Class cho Stats Grid trên màn hình Scholarships (Active Scholarships, Total Value,...)
// --- MODELS MỚI CHO SCHOLARSHIPS ---

// 1. Data Class cho Stats Grid trên màn hình Scholarships (CHỈ CÓ 3 THAM SỐ)
data class ScholarshipStat(
    val id: String,
    val count: String, // Ví dụ: "13+", "$500M+"
    val label: String, // Ví dụ: "Active Scholarships"
)

// 2. Data Class cho Danh sách Học bổng (ĐẦY ĐỦ THAM SỐ CHO CARD SCHOLARSHIPS)
data class Scholarship(
    val id: String,
    val title: String,
    val university: String,
    val location: String,
    val deadline: String,
    val matchPercentage: Int,
    val description: String,
    val level: String, // Ví dụ: "PhD", "Undergraduate"
    val salary: String, // Ví dụ: "$75000"
    val tags: List<String>,
    val canApply: Boolean
)