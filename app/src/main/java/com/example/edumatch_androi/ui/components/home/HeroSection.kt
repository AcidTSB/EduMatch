package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.TextGray


@Composable
fun HeroSection(navController: NavController, screenWidth: Int, isLoggedIn: Boolean) {
    val isMobile = screenWidth < 600
    val padding = if (isMobile) 24.dp else 100.dp
    val buttonHorizontalPadding = if (isMobile) 16.dp else 24.dp // Padding bên trong nút
    val buttonVerticalPadding = if (isMobile) 8.dp else 12.dp

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = padding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // AI-Powered Education Platform Tag
        Text(
            "⚡️ AI-Powered Education Platform",
            fontSize = 14.sp,
            color = EduMatchBlue,
            fontWeight = FontWeight.Medium
        )
        Spacer(Modifier.height(16.dp))

        // Tiêu đề Lớn
        Text(
            "Find Your Perfect\nScholarship Match\nwith AI Technology",
            fontSize = if (isMobile) 32.sp else 48.sp,
            fontWeight = FontWeight.ExtraBold,
            color = DarkText,
            textAlign = TextAlign.Center,
            lineHeight = if (isMobile) 40.sp else 60.sp
        )
        Spacer(Modifier.height(24.dp))

        // Mô tả
        Text(
            "Discover personalized scholarship opportunities and research positions using our AI-powered platform. Join thousands of students who found their perfect academic match.",
            fontSize = 16.sp,
            color = TextGray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = if (isMobile) 0.dp else 64.dp)
        )
        Spacer(Modifier.height(32.dp))

        // Nút chính
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(8.dp)) {
            Button(
                onClick = { navController.navigate("scholarships_route") },
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = buttonHorizontalPadding, vertical = buttonVerticalPadding),
                modifier = Modifier.weight(1f).height(if(isMobile) 40.dp else 50.dp) // Chia đều chiều rộng
            ) {
                Text("Browse Scholarships →")
            }
            Button(
                onClick = {
                    if (isLoggedIn) {
                        navController.navigate("dashboard_route") // ĐÃ ĐĂNG NHẬP -> DASHBOARD
                    } else {
                        navController.navigate("login_route") // CHƯA ĐĂNG NHẬP -> ĐĂNG NHẬP
                    }
                },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White,
                    contentColor = EduMatchBlue
                ),
                border = BorderStroke(1.dp, EduMatchBlue), // Sửa border thành EduMatchBlue
                contentPadding = PaddingValues(horizontal = buttonHorizontalPadding, vertical = buttonVerticalPadding),
                modifier = Modifier.weight(1f).height(if(isMobile) 40.dp else 50.dp)
            ) {
                Text("Post Opportunities", color = DarkText)
            }
        }
        Spacer(Modifier.height(24.dp))

        // Thống kê nhỏ
        Row(horizontalArrangement = Arrangement.spacedBy(if(isMobile) 8.dp else 32.dp)) {
            HeroStatItem("1000+", "Scholarships")
            HeroStatItem("95%", "Match Accuracy")
            HeroStatItem("50+", "Countries")
        }
    }
}

// Component nhỏ cho thống kê Hero
@Composable
fun HeroStatItem(count: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(count, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = DarkText)
        Text(label, fontSize = 14.sp, color = TextGray)
    }
}