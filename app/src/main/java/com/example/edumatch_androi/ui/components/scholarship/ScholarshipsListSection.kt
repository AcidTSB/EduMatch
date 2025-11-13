package com.example.edumatch_androi.ui.components.scholarship

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.Scholarship
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.foundation.layout.ExperimentalLayoutApi


@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ScholarshipsListSection(
    scholarships: List<Scholarship>,
    onViewDetailsClicked: (id: String) -> Unit,
    onApplyClicked: (id: String) -> Unit
) {
    Text("${scholarships.size} Scholarships Found", fontWeight = FontWeight.SemiBold, fontSize = 18.sp, color = DarkText)
    Spacer(Modifier.height(16.dp))

    val screenWidth = LocalConfiguration.current.screenWidthDp
    val columns = if (screenWidth > 1000) 3 else if (screenWidth > 600) 2 else 1 // 1, 2, hoặc 3 cột

    // Tính toán chiều rộng tối thiểu cho mỗi item để FlowRow hoạt động
    val minItemWidth = if (columns == 1) 300.dp else if (columns == 2) 200.dp else 150.dp

    // Dùng FlowRow để tạo lưới linh hoạt
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        scholarships.forEach { scholarship ->
            ScholarshipCard(
                scholarship = scholarship,
                onViewDetailsClicked = onViewDetailsClicked,
                onApplyClicked = onApplyClicked,
                modifier = Modifier
                    .widthIn(min = minItemWidth)
                    .weight(1f) // Chia đều không gian FlowRow
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ScholarshipCard(
    scholarship: Scholarship,
    onViewDetailsClicked: (id: String) -> Unit,
    onApplyClicked: (id: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isDeadlinePassed = scholarship.deadline.contains("Expired", ignoreCase = true)

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color(0xFFE5E5E5))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Phần trên: Match Percentage và Deadline
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(scholarship.deadline, fontSize = 12.sp, color = if(isDeadlinePassed) Color.Red else TextGray)
                Text("${scholarship.matchPercentage}% match", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Green)
            }
            Divider(Modifier.padding(vertical = 8.dp), color = Color(0xFFF5F5F5))

            // Tiêu đề và mô tả
            Text(scholarship.title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText)
            Text(scholarship.university, fontSize = 14.sp, color = TextGray)
            Spacer(Modifier.height(8.dp))
            Text(scholarship.description, fontSize = 14.sp, color = TextGray, maxLines = 3, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
            Spacer(Modifier.height(12.dp))

            // Tags
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                scholarship.tags.forEach { tag ->
                    TagItem(tag)
                }
            }
            Spacer(Modifier.height(12.dp))

            // Dòng dưới cùng: Salary/Duration và Buttons
            Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                // Thông tin Level và Salary
                Column(modifier = Modifier.weight(1f)) {
                    Text(scholarship.level, fontSize = 14.sp, color = TextGray)
                    Text(scholarship.salary, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = DarkText)
                }

                // Các nút hành động
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = { onViewDetailsClicked(scholarship.id) }) {
                        Text("View Details", color = TextGray)
                    }

                    if (isDeadlinePassed || !scholarship.canApply) {
                        // Nút "Deadline Passed" hoặc "Closed"
                        Button(
                            onClick = { /* Không làm gì */ },
                            enabled = false,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE0E0E0), contentColor = TextGray),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Deadline Passed", fontSize = 14.sp)
                        }
                    } else {
                        // Nút Apply Now
                        Button(onClick = { onApplyClicked(scholarship.id) }, shape = RoundedCornerShape(8.dp)) {
                            Text("Apply Now", fontSize = 14.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TagItem(tag: String) {
    Text(
        tag,
        fontSize = 12.sp,
        color = EduMatchBlue,
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(EduMatchBlue.copy(alpha = 0.1f))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    )
}