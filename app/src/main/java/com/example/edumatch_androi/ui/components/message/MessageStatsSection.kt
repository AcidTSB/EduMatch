package com.example.edumatch_androi.ui.components.message

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.edumatch_androi.data.model.MessageStat
import com.example.edumatch_androi.ui.components.message.MessageStatCard // <-- Đảm bảo import MessageStatCard

@Composable
fun MessageStatsSection(stats: List<MessageStat>, screenWidth: Int) {
    // Dùng Row để chia 4 cột ngang trên Desktop/Tablet.
    // Vì stats là List<MessageStat>, và MessageStat implement StatData,
    // chúng ta có thể truyền nó trực tiếp vào GenericStatCard.

    // Tận dụng component chia bố cục (FlowRow hoặc StatsSection) nếu bạn có:
    // Ví dụ: StatsSection(stats = stats, screenWidth = screenWidth)

    // Nếu chưa có component bố cục chung, dùng Row cơ bản:
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        stats.forEach { stat ->
            // SỬ DỤNG COMPONENT MỚI: MessageStatCard
            MessageStatCard(
                stat = stat,
                modifier = Modifier.weight(1f) // Chia đều 4 cột
            )
        }
    }
}