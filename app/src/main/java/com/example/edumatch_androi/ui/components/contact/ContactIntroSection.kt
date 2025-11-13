package com.example.edumatch_androi.ui.components.contact

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.ui.draw.clip

@Composable
fun ContactIntroSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Get in Touch", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = DarkText)
        Spacer(Modifier.height(16.dp))
        Text(
            "Have questions, feedback, or need support? We're here to help! Our team is dedicated to ensuring you have the best experience with EduMatch.",
            fontSize = 16.sp,
            color = TextGray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = if (isMobile) 0.dp else 64.dp)
        )
        Spacer(Modifier.height(24.dp))

        // Tags
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = if(isMobile) 0.dp else 120.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ✅ Dùng Modifier.weight(1f) để chia đều chiều rộng
            ContactTag("24/7 Online Support", Modifier.weight(1f))
            ContactTag("Dedicated Team", Modifier.weight(1f))
            ContactTag("Comprehensive Help", Modifier.weight(1f))
        }
    }
}

@Composable
fun ContactTag(label: String, modifier: Modifier = Modifier) {
    // Mức độ padding bên trong tag
    val innerPadding = PaddingValues(horizontal = 6.dp, vertical = 10.dp)

    // Sử dụng Box để căn giữa nội dung và buộc chiều cao (fillMaxHeight)
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(EduMatchBlue.copy(alpha = 0.1f))
            // Áp dụng padding bên trong tag
            .padding(innerPadding)
            .height(IntrinsicSize.Max), // <<< ĐÂY LÀ ĐIỂM QUAN TRỌNG: Buộc chiều cao bằng chiều cao tối đa của Row
        contentAlignment = Alignment.Center // Căn giữa Text
    ) {
        Text(
            label,
            fontSize = 14.sp,
            color = EduMatchBlue,
            textAlign = TextAlign.Center, // Căn giữa Text
            // Không áp dụng padding thêm ở Text để Text có không gian tối đa
        )
    }
}