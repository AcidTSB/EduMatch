package com.example.edumatch_androi.ui.components.message

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList // Chỉ giữ lại FilterList
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray

@Composable
fun MessageHeaderSection() {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val isMobile = screenWidth < 600

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            // Giới hạn chiều rộng tiêu đề, nhưng cho phép rộng hơn một chút khi không còn nút Disconnected
            modifier = Modifier.fillMaxWidth(if (isMobile) 0.7f else 0.8f)
        ) {
            // 1. TIÊU ĐỀ CHÍNH (Messages)
            Text(
                "Messages",
                fontSize = if (isMobile) 24.sp else 32.sp,
                fontWeight = FontWeight.SemiBold,
                color = DarkText,
                maxLines = 1
            )

            // 2. MÔ TẢ (Communicate with...)
            Text(
                "Communicate with scholarship providers and manage your conversations",
                fontSize = if (isMobile) 12.sp else 16.sp,
                color = TextGray,
                maxLines = 2,
                lineHeight = 16.sp
            )
        }

        // Khối 2: CHỈ CÒN NÚT FILTER
        Row(
            verticalAlignment = Alignment.CenterVertically,
            // Không cần horizontalArrangement.spacedBy(8.dp) nữa vì chỉ còn 1 nút
        ) {
            // Nút Filter
            TextButton(onClick = { /* TODO */ }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter", tint = TextGray.copy(alpha = 0.8f), modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Filter", color = TextGray, fontSize = 14.sp)
                }
            }
        }
    }
}