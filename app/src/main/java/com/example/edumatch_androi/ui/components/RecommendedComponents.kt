@file:OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)

package com.example.edumatch_androi.ui.components

import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.Fellowship
import androidx.compose.foundation.BorderStroke
import androidx.compose.ui.graphics.Color
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.CardBackgroundLight
import com.example.edumatch_androi.ui.theme.GreenAccent
import com.example.edumatch_androi.ui.theme.RedAccent
import com.example.edumatch_androi.ui.theme.TagText
import com.example.edumatch_androi.ui.theme.TagBackground


@Composable
fun RecommendedSection(
    fellowships: List<Fellowship>,
    onViewAllScholarships: () -> Unit,
    onViewDetailsClicked: (fellowshipId: String) -> Unit,
    onApplyClicked: (fellowshipId: String) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Recommended for You", fontWeight = FontWeight.SemiBold, fontSize = 20.sp, color = DarkText)
            TextButton(onClick = onViewAllScholarships) {
                Text("View All Scholarships →", color = EduMatchBlue, fontSize = 14.sp)
            }
        }
        Spacer(Modifier.height(16.dp))

        // Dùng LazyRow cho hiệu suất tốt hơn khi có nhiều thẻ
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(24.dp),
            contentPadding = PaddingValues(horizontal = 0.dp)
        ) {
            items(fellowships) { fellowship ->
                FellowshipCard(
                    fellowship = fellowship,
                    // Khi nút trong card này được nhấn, nó sẽ gọi hàm ở cấp cao hơn và truyền ID lên
                    onViewDetailsClicked = { onViewDetailsClicked(fellowship.id) },
                    onApplyClicked = { onApplyClicked(fellowship.id)}
                )
            }
        }
    }
}

@Composable
fun FellowshipCard(
    fellowship: Fellowship,
    onViewDetailsClicked: () -> Unit, // <-- THÊM THAM SỐ NÀY
    onApplyClicked: () -> Unit        // <-- THÊM THAM SỐ NÀY
) {
    Card(
        modifier = Modifier
            .width(360.dp)
            .height(IntrinsicSize.Min),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, BorderGray),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            // Header: Title & Match Percentage
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(fellowship.title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText, maxLines = 2, overflow = TextOverflow.Ellipsis)
                Text(
                    "${fellowship.matchPercentage}% match",
                    color = GreenAccent,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp
                )
            }
            Spacer(Modifier.height(8.dp))
            Text(fellowship.description, color = TextGray, fontSize = 13.sp, maxLines = 3, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.height(12.dp))

            // Tags
            FlowRow( // Sử dụng FlowRow (nếu có) để tags tự xuống hàng
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                fellowship.tags.forEach { tag ->
                    AssistChip(
                        // Thêm một onClick trống, đây là tham số bắt buộc
                        onClick = { /* Không cần làm gì khi nhấn vào tag */ },
                        // label là một Composable, không phải thuộc tính
                        label = { Text(tag, fontSize = 12.sp, fontWeight = FontWeight.Medium) },
                        // Các thuộc tính khác
                        modifier = Modifier.height(32.dp),
                        shape = RoundedCornerShape(8.dp), // Bo góc cho đẹp
                        colors = AssistChipDefaults.assistChipColors( // Dùng AssistChipDefaults
                            containerColor = TagBackground,
                            labelColor = TagText
                        ),
                        border = null // Không cần đường viền
                    )
                }
            }
            Spacer(Modifier.height(16.dp))

            // Details
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Type & Stipend Row
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Default.School, contentDescription = null, tint = TextGray, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(fellowship.type, color = TextGray, fontSize = 13.sp)
                    Spacer(Modifier.width(16.dp))
                    Icon(Icons.Default.AttachMoney, contentDescription = null, tint = TextGray, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(fellowship.stipend, color = TextGray, fontSize = 13.sp)
                }
                // Deadline Row
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = TextGray, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Deadline:", color = TextGray, fontSize = 13.sp)
                    Spacer(Modifier.width(4.dp))
                    Text(
                        fellowship.deadline,
                        color = if (fellowship.deadline == "Expired") RedAccent else TextGray,
                        fontWeight = if (fellowship.deadline == "Expired") FontWeight.Bold else FontWeight.Normal,
                        fontSize = 13.sp
                    )
                }
            }

            Spacer(Modifier.height(20.dp))

            // Buttons
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onViewDetailsClicked,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, BorderGray)
                ) {
                    Text("View Details", color = DarkText, fontSize = 13.sp)
                }
                Button(
                    onClick = onApplyClicked,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (fellowship.deadline == "Expired") Color(0xFFE0E0E0) else EduMatchBlue,
                        contentColor = if (fellowship.deadline == "Expired") TextGray else Color.White
                    ),
                    enabled = fellowship.deadline != "Expired"
                ) {
                    Text(if (fellowship.deadline == "Expired") "Deadline Passed" else "Apply Now", fontSize = 13.sp)
                }
            }
        }
    }
}