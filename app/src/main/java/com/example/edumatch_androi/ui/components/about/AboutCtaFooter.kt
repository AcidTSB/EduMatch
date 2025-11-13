package com.example.edumatch_androi.ui.components.about

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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.material3.ButtonDefaults
import androidx.compose.foundation.background

@Composable
fun AboutCtaFooter(navController: NavController, isLoggedIn: Boolean) {

    // Đích đến khi người dùng đã đăng nhập (UI chính)
    val loggedInRoute = "dashboard_route"

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF7F9FC)) // Background khớp với Our Values
            .padding(vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Ready to Find Your Perfect Match?", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.Blue, textAlign = TextAlign.Center)
        Text(
            "Join thousands of students who have found their ideal scholarships through EduMatch.",
            fontSize = 16.sp,
            color = DarkText,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(32.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {

            // Nút 1: Get Started Flow
            Button(
                onClick = {
                    if (isLoggedIn) {
                        navController.navigate(loggedInRoute)
                    } else {
                        navController.navigate("register_route")
                    }
                },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Blue)
            ) {
                Text("Get Started for Free")
            }

            // Nút 2: Browse Scholarships (Khác với Learn More ở Home)
            OutlinedButton(
                onClick = {
                    // Luôn cho phép duyệt học bổng, dù đã đăng nhập hay chưa
                    navController.navigate("scholarships_route")
                },
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, Color.Blue),
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
            ) {
                Text("Browse Scholarships", color = Color.Blue)
            }
        }
    }
}