package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue

@Composable
fun CtaFooterSection(horizontalPadding: Dp, navController: NavController, isLoggedIn: Boolean) {

    // Nút 1: Get Started Flow → LUÔN ĐẾN ĐĂNG KÝ
    val getStartedOnClick: () -> Unit = { navController.navigate("register_route") }

    // Nút 2: Learn More → LUÔN ĐẾN ĐĂNG NHẬP
    // val learnMoreOnClick: () -> Unit = { navController.navigate("login_route") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Ready to Find Your Perfect Match?", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = EduMatchBlue, textAlign = TextAlign.Center)
        Text(
            "Join thousands of students who have found their dream scholarships and research opportunities through EduMatch.",
            fontSize = 16.sp,
            color = DarkText,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(32.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Button(
                onClick = {
                    // ✅ KIỂM TRA TRẠNG THÁI
                    if (isLoggedIn) {
                        // ĐÃ ĐĂNG NHẬP: Dùng route có DashboardHeader
                        navController.navigate("register_flow_route")
                    } else {
                        // CHƯA ĐĂNG NHẬP: Dùng route công khai
                        navController.navigate("register_route")
                    }
                },
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
            ) {
                Text("Get Started Flow →")
            }
            OutlinedButton(
                onClick = { navController.navigate("about_route") },
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, DarkText),
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
            ) {
                Text("Learn More", color = DarkText)
            }
        }
    }
}