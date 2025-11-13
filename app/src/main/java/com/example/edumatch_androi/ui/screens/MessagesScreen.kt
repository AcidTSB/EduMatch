@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.* // Cần import all runtime cho rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.components.FooterSectionRegister
import com.example.edumatch_androi.ui.components.message.MessageHeaderSection
import com.example.edumatch_androi.ui.components.message.SearchAndFilterBar
import com.example.edumatch_androi.ui.components.message.MessagesAndContactsSection
import com.example.edumatch_androi.ui.components.message.MessageStatsSection
import com.example.edumatch_androi.ui.viewmodel.MessagesViewModel
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel // <<< DÙNG CHUNG VM ĐỂ LẤY USER
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.launch // Cần cho đăng xuất

@Composable
fun MessagesScreen(
    navController: NavController,
    messagesViewModel: MessagesViewModel = viewModel(), // ViewModel cho tin nhắn
    dashboardViewModel: DashboardViewModel = viewModel() // ViewModel cho User/Auth
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp

    // ✅ LẤY DỮ LIỆU USER THẬT TỪ DASHBOARD VIEWMODEL
    val user = dashboardViewModel.currentUser
    val isLoggedIn = user.uid.isNotBlank()
    val coroutineScope = rememberCoroutineScope() // Cần cho Đăng xuất

    // Kiểm tra để đảm bảo người dùng đã đăng nhập trước khi hiển thị Header
    if (!isLoggedIn) {
        // Có thể hiển thị màn hình Loading hoặc chuyển hướng về Login/Home nếu cần
        Text("Loading user data or unauthorized access...", modifier = Modifier.fillMaxSize())
        return
    }

    Scaffold(
        topBar = {
            if (isLoggedIn) {
                DashboardHeader(
                    userName = user.displayName, // <<< TRUYỀN TÊN THẬT
                    userEmail = user.userEmail,  // <<< TRUYỀN EMAIL THẬT
                    role = user.role,            // <<< TRUYỀN ROLE THẬT
                    screenWidth = screenWidth,
                    onHomeClicked = { navController.navigate("home_route") },
                    onDashboardClicked = { navController.navigate("dashboard_route") },
                    onScholarshipsClicked = { navController.navigate("scholarships_route") },
                    onApplicationsClicked = { navController.navigate("applications_route") },
                    onMessagesClicked = { navController.navigate("messages_route") },
                    activeScreen = "Messages",
                    // ✅ LOGIC ĐĂNG XUẤT
                    onSignOutClicked = {
                        dashboardViewModel.signOut { // Gọi hàm signOut trong DashboardVM
                            coroutineScope.launch {
                                navController.navigate("home_route") {
                                    popUpTo("home_route") { inclusive = true }
                                }
                            }
                        }
                    }
                )
            }
        },
        containerColor = Color(0xFFFAFAFA)
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = horizontalPadding, vertical = 32.dp)
        ) {
            // 1. HEADER CHÍNH
            MessageHeaderSection()
            Spacer(Modifier.height(32.dp))

            // 2. THANH TÌM KIẾM
            SearchAndFilterBar()
            Spacer(Modifier.height(24.dp))

            // 3. STATS CARDS
            MessageStatsSection(messagesViewModel.messageStats, screenWidth)
            Spacer(Modifier.height(32.dp))

            // 4. KHỐI CHIA 2 CỘT (Đã chuyển thành bố cục dọc)
            MessagesAndContactsSection(
                screenWidth = screenWidth,
                messages = messagesViewModel.recentMessages,
                contacts = messagesViewModel.quickContacts
            )
            Spacer(Modifier.height(80.dp))

            // 5. FOOTER
            FooterSectionRegister()
        }
    }
}