package com.example.edumatch_androi.ui.viewmodel

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.ViewModel
import com.example.edumatch_androi.data.model.Message
import com.example.edumatch_androi.data.model.MessageStat
import com.example.edumatch_androi.data.model.MessageContact

class MessagesViewModel: ViewModel() {
    // Dữ liệu giả định cho 4 thẻ thống kê (Giữ nguyên)
    val messageStats = listOf(
        MessageStat(
            title = "Total Messages",
            count = 5,
            icon = Icons.Default.ChatBubble,
            color = Color(0xFF42A5F5) // Blue
        ),
        MessageStat(
            title = "Unread Messages",
            count = 3,
            icon = Icons.Default.MarkChatUnread,
            color = Color(0xFFF44336) // Red
        ),
        MessageStat(
            title = "Online Users",
            count = 2,
            icon = Icons.Default.Person,
            color = Color(0xFF4CAF50) // Green
        ),
        MessageStat(
            title = "Offline Status",
            count = 0,
            icon = Icons.Default.WifiOff,
            color = Color(0xFF757575), // Gray
            description = "Real-time Status"
        )
    )

    // ✅ DỮ LIỆU MẪU CHO DANH SÁCH TIN NHẮN
    val recentMessages = listOf(
        Message(
            id = "1",
            senderName = "Scholarship Admin",
            lastMessage = "Bạn đã nộp hồ sơ thành công.",
            timestamp = "10:30 AM",
            unreadCount = 2,
            isOnline = true
        ),
        Message(
            id = "2",
            senderName = "Tutor Group A",
            lastMessage = "Lịch học tuần này có thay đổi.",
            timestamp = "Hôm qua",
            unreadCount = 0,
            isOnline = false
        ),
        Message(
            id = "3",
            senderName = "Jane Doe",
            lastMessage = "Bạn có thể kiểm tra lại hồ sơ...",
            timestamp = "Thứ Hai",
            unreadCount = 5,
            isOnline = true
        ),
        Message(
            id = "4",
            senderName = "Harvard University",
            lastMessage = "Hồ sơ của bạn đã được duyệt.",
            timestamp = "05/11/2025",
            unreadCount = 0,
            isOnline = true
        )
    )

    // ✅ DỮ LIỆU MẪU CHO DANH BẠ NHANH
    val quickContacts = listOf(
        MessageContact(
            id = "c1",
            name = "Mr. Smith",
            organization = "Admin Đại học ABC",
            isOnline = true
        ),
        MessageContact(
            id = "c2",
            name = "Ms. Lee",
            organization = "Hỗ trợ Kỹ thuật",
            isOnline = false
        ),
        MessageContact(
            id = "c3",
            name = "Dr. Chen",
            organization = "Ban Tuyển sinh MIT",
            isOnline = true
        )
    )

    // TODO: Thêm logic để load dữ liệu thật từ API hoặc Database
}