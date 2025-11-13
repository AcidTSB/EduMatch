package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.screens.DarkText
import com.example.edumatch_androi.ui.screens.DividerGray
import com.example.edumatch_androi.ui.screens.EduMatchBlue
import com.example.edumatch_androi.ui.screens.NavbarButton // <<< CẦN IMPORT NẾU NAVBARBUTTON LÀ HÀM RIÊNG

@Composable
fun CustomHeaderRow(
    onNavigateToRegister: () -> Unit,
    onSignInClicked: () -> Unit,
    navController: NavController, // <<< THÊM NAV CONTROLLER
    activeScreen: String // <<< THÊM THAM SỐ BỊ THIẾU
) {
    // Logic để kiểm tra nút nào đang active
    val isActive: (String) -> Boolean = { routeName ->
        activeScreen.equals(routeName, ignoreCase = true)
    }

    // ... (Giữ nguyên CustomHeaderRow)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .shadow(1.dp)
            .background(Color.White)
            .padding(horizontal = 16.dp), // Padding tổng thể
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 1. Logo (Cố định bên trái)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(
                modifier = Modifier.size(32.dp),
                shape = RoundedCornerShape(8.dp),
                color = EduMatchBlue
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.width(8.dp))
            Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
        }

        // **Thêm khoảng trống linh hoạt, sau đó là Navbar có thể cuộn ngang**
        Spacer(Modifier.width(20.dp)) // Khoảng cách nhỏ giữa Logo và Navbar

        // 2. Navbar Links (Cuộn ngang)
        Row(
            modifier = Modifier
                .weight(1f) // Chiếm phần không gian còn lại
                .horizontalScroll(rememberScrollState()), // Cho phép cuộn ngang
            verticalAlignment = Alignment.CenterVertically
        ) {
            // SỬ DỤNG HÀM CÓ NAVIGATION
            NavbarButton("Home", isActive = isActive("home_route"), onClick = { navController.navigate("home_route") })
            NavbarButton("About", isActive = isActive("about_route"), onClick = { navController.navigate("about_route") })
            NavbarButton("Scholarships", isActive = isActive("scholarships_route"), onClick = { navController.navigate("scholarships_route") })
            NavbarButton("Pricing", isActive = isActive("pricing_route"), onClick = { navController.navigate("pricing_route") })
            NavbarButton("Contact", isActive = isActive("contact_route"), onClick = { navController.navigate("contact_route") })

            // Spacer nhỏ sau Contact để cuộn thoải mái hơn
            Spacer(Modifier.width(4.dp))
        }

        // 3. Actions (Cố định bên phải)
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            VerticalDivider(
                modifier = Modifier
                    .height(24.dp)
                    .padding(horizontal = 8.dp),
                color = DividerGray
            )

            TextButton(
                onClick = onSignInClicked,
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
            ) {
                Text("Sign In", color = Color.Black, fontSize = 14.sp, fontWeight = FontWeight.Medium)
            }
            Spacer(Modifier.width(4.dp))
            Button(
                onClick = onNavigateToRegister,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue),
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
            ) {
                Text("Get Started", color = Color.White, fontSize = 14.sp)
            }
        }
    }
}