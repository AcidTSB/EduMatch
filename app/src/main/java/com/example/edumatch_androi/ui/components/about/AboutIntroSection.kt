package com.example.edumatch_androi.ui.components.about

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material3.Icon
import androidx.compose.ui.draw.clip
import com.example.edumatch_androi.data.model.AboutStat

@Composable
fun AboutIntroSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("About EduMatch", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.Blue)
        Spacer(Modifier.height(16.dp))
        Text(
            "We’re on a mission to democratize access to education by connecting students with the right scholarships and research opportunities using AI-powered matching.",
            fontSize = 18.sp,
            color = TextGray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = if (isMobile) 0.dp else 64.dp)
        )
        Spacer(Modifier.height(24.dp))

        // Tags
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AboutTag("Founded in 2022")
            AboutTag("AI-Powered")
            AboutTag("Global Reach")
        }
    }

    // Khối Stats dưới (Màu nền khác)
    Column(modifier = Modifier
        .fillMaxWidth()
        .background(Color(0xFFF0F8FF)) // Light Blue Background
        .padding(vertical = 40.dp, horizontal = horizontalPadding)
    ) {
        AboutStatsGrid(screenWidth)
    }
}

@Composable
fun AboutTag(label: String) {
    Text(
        label,
        fontSize = 14.sp,
        color = Color.Blue,
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color.Blue.copy(alpha = 0.1f))
            .padding(horizontal = 12.dp, vertical = 6.dp)
    )
}

@Composable
fun AboutStatsGrid(screenWidth: Int) {
    val isMobile = screenWidth < 600

    val stats = listOf(
        AboutStat("50,000+", "Students Helped", Icons.Default.People),
        AboutStat("2,000+", "Scholarships Listed", Icons.Default.School),
        AboutStat("$500M+", "Total Awards Matched", Icons.Default.MonetizationOn),
        AboutStat("200+", "Partner Institutions", Icons.Default.Star)
    )

    if (isMobile) {
        Column(verticalArrangement = Arrangement.spacedBy(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            stats.chunked(2).forEach { row ->
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                    row.forEach { stat ->
                        StatItem(stat.count, stat.label, stat.icon, Modifier.weight(1f))
                    }
                }
            }
        }
    } else {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
            stats.forEach { stat ->
                StatItem(stat.count, stat.label, stat.icon, Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun StatItem(count: String, label: String, icon: ImageVector, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(icon, contentDescription = null, tint = Color.Blue, modifier = Modifier.size(36.dp))
        Spacer(Modifier.height(8.dp))
        Text(count, fontWeight = FontWeight.Bold, fontSize = 24.sp, color = DarkText)
        Spacer(Modifier.height(4.dp))
        Text(label, fontSize = 14.sp, color = TextGray, textAlign = TextAlign.Center)
    }
}