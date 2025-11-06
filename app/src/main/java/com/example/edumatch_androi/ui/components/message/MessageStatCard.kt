package com.example.edumatch_androi.ui.components.message


import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.MessageStat // Dùng Data Model mới
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.DarkText

@Composable
fun MessageStatCard(stat: MessageStat, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.height(110.dp),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, BorderGray),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(stat.title, color = TextGray, fontSize = 14.sp)
                // Hiển thị icon theo dữ liệu (hoặc WifiOff nếu là Offline Status)
                Icon(stat.icon, contentDescription = null, tint = stat.color.copy(alpha = 0.8f), modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.height(8.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(stat.count.toString(), fontWeight = FontWeight.Bold, fontSize = 28.sp, color = DarkText)
                Spacer(Modifier.width(8.dp))

                // --- PHẦN LOGIC THAY THẾ (Change -> Description) ---
                if (stat.description != null) {
                    // Nếu có description (dùng cho thẻ Real-time Status)
                    Text(
                        stat.description,
                        color = stat.color,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}