@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.edumatch_androi.ui.screens

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.compose.foundation.layout.padding
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.theme.LightGrayBackground
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel // Cần ViewModel để lấy username

@Composable
fun DashboardRegisterWrapper(navController: NavController, dashboardViewModel: DashboardViewModel = viewModel()) {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val user = dashboardViewModel.currentUser // Lấy thông tin người dùng đã đăng nhập

    Scaffold(
        topBar = {
            DashboardHeader(
                userName = user.displayName,// Truyền tên người dùng đã đăng nhập
                userEmail = user.userEmail,
                role = user.role,
                screenWidth = screenWidth,
                // Định nghĩa Navigation cho Header để các nút khác hoạt động
                onHomeClicked = { navController.navigate("home_route") },
                onDashboardClicked = { navController.navigate("dashboard_route") },
                onScholarshipsClicked = { navController.navigate("scholarships_route") },
                onApplicationsClicked = { navController.navigate("applications_route") },
                onMessagesClicked = { navController.navigate("messages_route") },
                activeScreen = "",
                onSignOutClicked = {
                    navController.navigate("home_route") {
                        popUpTo("home_route") { inclusive = true }
                    }
                }
            )
        },
        containerColor = LightGrayBackground
    ) { padding ->
        // Gọi màn hình Đăng ký thực tế và truyền padding của Scaffold
        RegisterScreen(
            navController = navController,
            onNavigateBack = { navController.popBackStack() },
            // Thêm padding từ Scaffold vào RegisterScreen
            modifier = Modifier.fillMaxSize().padding(padding)
        )
    }
}

