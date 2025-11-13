package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.QueryStats
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
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

@Composable
fun WhyChooseSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Why Choose EduMatch?", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = DarkText)
        Text(
            "Our platform combines cutting-edge AI with comprehensive scholarship data\nto give you the best possible matches.",
            fontSize = 16.sp,
            color = TextGray,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(40.dp))

        // 3 Khối tính năng (Sử dụng FlowRow hoặc Column/Row để Responsive)
        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                FeatureCard(Icons.Default.Settings, "AI-Powered Matching", "Our advanced algorithms analyze your profile and preferences to recommend scholarships perfectly tailored to your academic background, interests, and goals.")
                FeatureCard(Icons.Default.FlashOn, "Real-Time Notifications", "Get instant alerts when new scholarships match your profile or when application deadlines are approaching.")
                FeatureCard(Icons.Default.QueryStats, "Detailed Analytics", "Track your application progress, success rates, and get insights to improve your scholarship application strategy.")
            }
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                FeatureCard(Icons.Default.Settings, "AI-Powered Matching", "Our advanced algorithms analyze your profile and preferences to recommend scholarships perfectly tailored to your academic background, interests, and goals.", Modifier.weight(1f))
                FeatureCard(Icons.Default.FlashOn, "Real-Time Notifications", "Get instant alerts when new scholarships match your profile or when application deadlines are approaching.", Modifier.weight(1f))
                FeatureCard(Icons.Default.QueryStats, "Detailed Analytics", "Track your application progress, success rates, and get insights to improve your scholarship application strategy.", Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun FeatureCard(icon: ImageVector, title: String, description: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.width(if (modifier == Modifier) 300.dp else Dp.Unspecified), // Đảm bảo width trên Mobile
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Icon(icon, contentDescription = null, tint = Color.Blue, modifier = Modifier.size(32.dp))
            Spacer(Modifier.height(16.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText)
            Spacer(Modifier.height(8.dp))
            Text(description, fontSize = 14.sp, color = TextGray)
        }
    }
}