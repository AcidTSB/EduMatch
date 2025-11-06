package com.example.edumatch_androi.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.ApplicationStat
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.DarkText

// --- HÀM STATSSECTION ĐÃ SỬA: LOGIC RESPONSIVE 2x2 ---

@Composable
fun StatsSection(stats: List<ApplicationStat>, screenWidth: Int) { // ✅ NHẬN screenWidth
    if (stats.isEmpty()) return

    val isMobileLayout = screenWidth <= 600

    // Khối code này thay thế cho việc sử dụng Row/Column phức tạp
    // Nó đảm bảo các thẻ chia đều không gian và xuống hàng khi cần

    if (isMobileLayout) {
        // BỐ CỤC 2 HÀNG (2x2) CHO MOBILE
        Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp)) {
            // Hàng 1: [Thẻ 1] [Thẻ 2]
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                if (stats.size > 0) StatCard(stats[0], Modifier.weight(1f).padding(8.dp))
                if (stats.size > 1) StatCard(stats[1], Modifier.weight(1f).padding(8.dp))
            }
            Spacer(Modifier.height(16.dp))

            // Hàng 2: [Thẻ 3] [Thẻ 4]
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                if (stats.size > 2) StatCard(stats[2], Modifier.weight(1f).padding(8.dp))
                if (stats.size > 3) StatCard(stats[3], Modifier.weight(1f).padding(8.dp))
            }
        }
    } else {
        // BỐ CỤC 1 HÀNG (1x4) CHO DESKTOP
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            stats.forEach { stat ->
                // Chia 4 cột đều nhau trên Desktop
                StatCard(stat, Modifier.weight(1f).padding(8.dp))
            }
        }
    }
}


@Composable
fun StatCard(stat: ApplicationStat, modifier: Modifier = Modifier) {
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
                Icon(stat.icon, contentDescription = null, tint = TextGray.copy(alpha = 0.6f), modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.height(8.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(stat.count.toString(), fontWeight = FontWeight.Bold, fontSize = 28.sp, color = DarkText)
                Spacer(Modifier.width(8.dp))
                // Change indicator
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(stat.color.copy(alpha = 0.15f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Icon(
                        if (stat.change >= 0) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = null,
                        tint = stat.color,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        "${stat.change}",
                        color = stat.color,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}