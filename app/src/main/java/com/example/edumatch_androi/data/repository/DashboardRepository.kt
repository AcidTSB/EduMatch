
package com.example.edumatch_androi.data.repository

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AllInbox
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.CheckCircleOutline
import androidx.compose.material.icons.filled.HourglassEmpty
import com.example.edumatch_androi.data.model.Application
import com.example.edumatch_androi.data.model.ApplicationStat
import com.example.edumatch_androi.data.model.Fellowship
import com.example.edumatch_androi.data.model.Notification
import com.example.edumatch_androi.ui.theme.BlueAccent
import com.example.edumatch_androi.ui.theme.GreenAccent
import com.example.edumatch_androi.ui.theme.YellowAccent
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
//import com.example.edumatch_androi.data.model.ScholarshipStat
import com.example.edumatch_androi.data.model.*

class DashboardRepository {
    // --- MOCK DATA (Thay thế bằng Firebase Firestore logic thực tế) ---

    // Dữ liệu giả lập cho các thẻ thống kê
    private fun mockStats() = listOf(
        ApplicationStat("Total Applications", 0, 2, GreenAccent, Icons.Default.AllInbox),
        ApplicationStat("In Review", 0, 1, YellowAccent, Icons.Default.HourglassEmpty),
        ApplicationStat("Accepted", 0, 1, GreenAccent, Icons.Default.CheckCircleOutline),
        ApplicationStat("Saved", 3, 3, BlueAccent, Icons.Default.BookmarkBorder)
    )

    // Dữ liệu giả lập cho các học bổng đề xuất
    private fun mockFellowships() = listOf(
        Fellowship("1", "MIT AI Research Fellowship", "MIT", "United States", 95,
            listOf("Artificial Intelligence", "Machine Learning"), "$75000", "PhD", "Expired",
            "Join our cutting-edge artificial intelligence research lab working on machine learning applications for real-world problems..."),
        Fellowship("2", "Full-Stack Development Research Grant", "Tech University", "United States", 88,
            listOf("Computer Science", "Software Engineering"), "$50000", "Graduate", "Expired",
            "Looking for talented students to join our research team focusing on modern web technologies and distributed systems. Wor..."),
        Fellowship("3", "Sustainability Engineering Grant", "Green Tech University", "United States", 72,
            listOf("Environmental Engineering", "Sustainability"), "$45000", "Graduate", "Expired",
            "Research opportunity in renewable energy systems and environmental engineering solutions. Help develop sustainable techn...")
    )

    // Dữ liệu giả lập cho các thông báo
    private fun mockNotifications() = listOf(
        Notification("Application Status Update", "Your application to MIT AI Research Fellowship is being reviewed", "Sep 28, 2024"),
        Notification("Application Accepted!", "Congratulations! Your application to Full-Stack Development Research Grant has been accepted", "Sep 25, 2024", isAccepted = true),
        Notification("Deadline Reminder", "Application deadline for Google PhD Fellowship is approaching (8 days left)", "Sep 20, 2024", isImportant = true),
        Notification("New Scholarship Match", "Tech Scholarships matches your profile", "Sep 18, 2024")
    )

    private fun mockApplications() = listOf(
        Application(
            id = "app1",
            title = "MIT AI Research Fellowship",
            university = "MIT",
            status = "Pending"
        ),
        Application(
            id = "app2",
            title = "Full-Stack Development Research Grant",
            university = "Tech University",
            status = "Accepted"
        ),
        Application(
            id = "app3",
            title = "Google PhD Fellowship",
            university = "Google",
            status = "Rejected"
        )
    )

    // --- CÁC HÀM TRUY CẬP DỮ LIỆU (Async Flow) ---
    fun getApplicationStats(): Flow<List<ApplicationStat>> = flow {
        // Mô phỏng độ trễ khi tải dữ liệu
        delay(500)
        emit(mockStats())
    }

    fun getRecommendedFellowships(): Flow<List<Fellowship>> = flow {
        delay(500)
        emit(mockFellowships())
    }

    fun getRecentNotifications(): Flow<List<Notification>> = flow {
        delay(500)
        emit(mockNotifications())
    }

    // Các hàm khác để lấy "Recent Applications" (nếu có dữ liệu thật)
    fun getRecentApplications(): Flow<List<Application>> = flow {
        delay(500)
        emit(mockApplications())
    }


    // --- MOCK DATA MỚI CHO SCHOLARSHIPS ---
    private fun mockScholarshipStats() = listOf(
        ScholarshipStat(id = "s1", count = "13+", label = "Active Scholarships"), // <<< CHỈ 3 THAM SỐ
        ScholarshipStat(id = "s2", count = "$500M+", label = "Total Value"),
        ScholarshipStat(id = "s3", count = "21+", label = "Study Fields"),
        ScholarshipStat(id = "s4", count = "95%", label = "Match Rate")
    )

    private fun mockScholarshipsList(): List<Scholarship> = listOf(
        Scholarship( // Dùng Scholarship (11 tham số)
            id = "sch1", title = "Google PhD Fellowship", university = "Google", location = "United States",
            deadline = "Deadline: Expired", matchPercentage = 92,
            description = "Prestigious fellowship program for PhD students conducting research in computer science and related fields.",
            level = "PhD", salary = "$100000", tags = listOf("Computer Science", "Research"), canApply = false
        ),
        Scholarship(
            id = "sch2", title = "MIT AI Research Fellowship", university = "MIT", location = "United States",
            deadline = "Deadline: Nov 25, 2025", matchPercentage = 90,
            description = "Join our cutting-edge artificial intelligence research lab working on machine learning applications for real-world problems.",
            level = "Graduate", salary = "$43000", tags = listOf("Cloud Computing", "DevOps"), canApply = true
        )
    )

// --- CÁC HÀM TRUY CẬP DỮ LIỆU MỚI ---

    fun getScholarshipStats(): Flow<List<ScholarshipStat>> = flow {
        delay(500)
        emit(mockScholarshipStats())
    }

    fun getAllScholarships(): Flow<List<Scholarship>> = flow {
        delay(500)
        emit(mockScholarshipsList()) // <<< GỌI HÀM ĐÃ ĐƯỢC CHỈ ĐỊNH TYPE
    }
}

