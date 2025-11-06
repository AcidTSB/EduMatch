package com.example.edumatch_androi.ui.components.message

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.People // Thêm icon People cho Contacts
import androidx.compose.material3.*
import androidx.compose.runtime.* // Import all runtime to get remember, mutableStateOf, etc.
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.data.model.Message
import com.example.edumatch_androi.data.model.MessageContact // Đã đổi tên Contact thành MessageContact

// Enum đơn giản để quản lý trạng thái Tabs
enum class MessageTab { MESSAGES, CONTACTS }

@Composable
fun MessagesAndContactsSection(
    screenWidth: Int,
    messages: List<Message>,
    contacts: List<MessageContact>
) {
    val isDesktop = screenWidth > 768

    if (isDesktop) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(32.dp)) {
            // TRÊN DESKTOP: MessageListArea và QuickContactsArea hiển thị song song.
            // MessageListArea sẽ cần biết contacts để chuyển tab nội bộ.
            Column(modifier = Modifier.weight(2f)) { MessageListArea(messages, contacts) }
            Column(modifier = Modifier.weight(1f)) { QuickContactsArea(contacts) }
        }
    } else {
        // TRÊN MOBILE: Xếp chồng dọc.
        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(32.dp)) {
            MessageListArea(messages, contacts)
            QuickContactsArea(contacts)
        }
    }
}


// Phần Danh sách tin nhắn (Recent Messages) - ĐÃ THÊM LOGIC TABS VÀ CÁC HÀM NỘI DUNG
@Composable
fun MessageListArea(messages: List<Message>, contacts: List<MessageContact>) { // <-- Sửa tham số contact thành contacts
    // 1. Khởi tạo State cho Tabs
    var selectedTab by remember { mutableStateOf(MessageTab.MESSAGES) }
    val tabs = listOf("Messages", "Contacts")
    val selectedTabIndex = when(selectedTab) {
        MessageTab.MESSAGES -> 0
        MessageTab.CONTACTS -> 1
    }

    Column {
        // Tabs Messages / Contacts
        TabRow(selectedTabIndex = selectedTabIndex, modifier = Modifier.height(40.dp)) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    // Tab có logic chọn
                    selected = selectedTabIndex == index,
                    onClick = {
                        selectedTab = if (index == 0) MessageTab.MESSAGES else MessageTab.CONTACTS
                    },
                    text = { Text(title, fontWeight = FontWeight.SemiBold) }
                )
            }
        }

        Spacer(Modifier.height(24.dp))

        Card(
            modifier = Modifier.fillMaxWidth().height(400.dp),
            shape = RoundedCornerShape(8.dp),
            border = BorderStroke(1.dp, Color(0xFFE5E5E5)),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            // Tiêu đề
            Text(
                when(selectedTab) {
                    MessageTab.MESSAGES -> "Recent Messages"
                    MessageTab.CONTACTS -> "All Contacts"
                },
                color = DarkText,
                fontWeight = FontWeight.SemiBold,
                fontSize = 18.sp,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp)
            )
            Divider(color = Color(0xFFE5E5E5))

            // Hiển thị nội dung dựa trên State
            when (selectedTab) {
                MessageTab.MESSAGES -> MessageContent(messages)
                MessageTab.CONTACTS -> ContactContent(contacts)
            }
        }
    }
}

// Hàm hiển thị nội dung Messages
@Composable
fun MessageContent(messages: List<Message>) {
    if (messages.isEmpty()) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(Icons.Default.Chat, contentDescription = null, tint = TextGray.copy(alpha = 0.3f), modifier = Modifier.size(48.dp))
            Spacer(Modifier.height(16.dp))
            Text("No messages yet", color = TextGray, fontSize = 14.sp)
        }
    } else {
        // TODO: Hiển thị danh sách tin nhắn
        Text("Danh sách tin nhắn sẽ được hiển thị ở đây (Số lượng: ${messages.size})", modifier = Modifier.padding(16.dp))
    }
}

// Hàm hiển thị nội dung Contacts
@Composable
fun ContactContent(contacts: List<MessageContact>) {
    if (contacts.isEmpty()) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(Icons.Default.People, contentDescription = null, tint = TextGray.copy(alpha = 0.3f), modifier = Modifier.size(48.dp))
            Spacer(Modifier.height(16.dp))
            Text("No contacts available", color = TextGray, fontSize = 14.sp)
        }
    } else {
        // TODO: Hiển thị danh sách liên hệ
        Text("Danh sách liên hệ sẽ được hiển thị ở đây (Số lượng: ${contacts.size})", modifier = Modifier.padding(16.dp))
    }
}

// Phần Danh bạ nhanh (Quick Contacts) - GIỮ NGUYÊN
@Composable
fun QuickContactsArea(contacts: List<MessageContact>) {
    Card(
        modifier = Modifier.fillMaxWidth().height(470.dp),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, Color(0xFFE5E5E5)),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            Text(
                "Quick Contacts",
                fontWeight = FontWeight.SemiBold,
                fontSize = 18.sp,
                color = DarkText,
                modifier = Modifier.fillMaxWidth().background(Color.White).padding(16.dp)
            )
            Divider(color = Color(0xFFE5E5E5))

            if (contacts.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("No contacts available", color = TextGray, fontSize = 14.sp)
                }
            } else {
                // TODO: Hiển thị danh sách liên hệ
                Text("Danh sách liên hệ sẽ được hiển thị ở đây", modifier = Modifier.padding(16.dp))
            }
        }
    }
}