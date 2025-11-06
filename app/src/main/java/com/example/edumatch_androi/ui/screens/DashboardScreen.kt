@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.* // Import TẤT CẢ các Components
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.LightGrayBackground
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
import androidx.compose.ui.graphics.Color
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.example.edumatch_androi.ui.components.FooterSectionRegister

@Composable
fun DashboardScreen(
    navController: NavController,
    viewModel: DashboardViewModel = viewModel(),
    // THÊM CÁC THAM SỐ ĐIỀU HƯỚNG BỊ THIẾU
    onHomeClicked: () -> Unit,
    onDashboardClicked: () -> Unit,
    onScholarshipsClicked: () -> Unit,
    onApplicationsClicked: () -> Unit,
    onMessagesClicked: () -> Unit,
    onViewDetailsClicked: (fellowshipId: String) -> Unit,
    onApplyClicked: (fellowshipId: String) -> Unit
) {
    val scrollState = rememberScrollState()

    // LẤY CHIỀU RỘNG MÀN HÌNH ĐỂ LÀM RESPONSIVE
    val screenWidth = LocalConfiguration.current.screenWidthDp

    // Lấy tất cả các state từ ViewModel
    val user = viewModel.currentUser
    val stats = viewModel.stats
    val recentApplications = viewModel.recentApplications
    val notifications = viewModel.notifications
    val recommendedFellowships = viewModel.recommended

    // ✅ THÊM STATE ĐỂ QUẢN LÝ TRẠNG THÁI MỞ RỘNG/THU GỌN
    var isNotificationExpanded by remember { mutableStateOf(false) }

    // SỬ DỤNG BIẾN PADDING LINH HOẠT
    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp

    Scaffold(
        topBar = {
            DashboardHeader(
                userName = user.displayName,
                screenWidth = screenWidth,
                onHomeClicked = { /* ... */ },
                onDashboardClicked = { /* ... */ },
                onScholarshipsClicked = { navController.navigate("scholarships_route") },
                onApplicationsClicked = { navController.navigate("applications_route") },
                onMessagesClicked = { navController.navigate("messages_route") }
            )
        },
        containerColor = LightGrayBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(scrollState)
                // ÁP DỤNG PADDING LINH HOẠT Ở ĐÂY
                .padding(horizontal = horizontalPadding, vertical = 32.dp)
        ) {
            // 1. WELCOME SECTION (Đã giảm font size)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Lời chào (Vùng 1)
                Column(modifier = Modifier.fillMaxWidth(0.65f)) { // Chỉ chiếm 65% để chừa chỗ cho nút
                    Text(
                        "Welcome back, ${user.displayName}!",
                        fontSize = if (screenWidth > 600) 32.sp else 20.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = DarkText,
                        maxLines = 2, // Cho phép xuống dòng
                        lineHeight = 26.sp // Điều chỉnh khoảng cách dòng cho dễ đọc
                    )
                    Text(
                        "Here's what's happening with your scholarship applications",
                        fontSize = if (screenWidth > 600) 16.sp else 14.sp,
                        color = TextGray,
                        maxLines = 2 // Cho phép xuống dòng
                    )
                }

                // Nút Find Scholarships (Vùng 2)
                OutlinedButton(
                    onClick = { navController.navigate("scholarships_route") },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = EduMatchBlue),
                    border = BorderStroke(1.dp, EduMatchBlue)
                ) {
                    Icon(Icons.Default.Search, contentDescription = null, Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Find Scholarships")
                }
            }
            Spacer(Modifier.height(40.dp))

            // 2. STATS CARDS
            StatsSection(stats = stats, screenWidth = screenWidth)
            Spacer(Modifier.height(48.dp))

            // 3. RECENT APPLICATIONS & NOTIFICATIONS
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(32.dp)
            ) {
                RecentApplicationsSection(
                    modifier = Modifier.weight(1f),
                    applications = recentApplications,
                    onFindScholarships = { navController.navigate("scholarships_route") }
                )
                NotificationsSection(
                    modifier = Modifier.weight(1f),
                    notifications = notifications
                )
            }
            Spacer(Modifier.height(48.dp))

            // 4. RECOMMENDED SECTION
            RecommendedSection(
                fellowships = recommendedFellowships,
                onViewAllScholarships = { navController.navigate("scholarships_route") },
                onViewDetailsClicked = { fellowshipId ->
                    navController.navigate("scholarship_details_route/$fellowshipId")
                },
                onApplyClicked = { fellowshipId ->
                    println("Apply clicked for fellowship ID: $fellowshipId")
                }
            )
            Spacer(Modifier.height(40.dp))

            // 5. QUICK ACTIONS
            QuickActionsSection()
            Spacer(Modifier.height(60.dp))

            // 6. FOOTER
            FooterSectionRegister()
        }
    }
}