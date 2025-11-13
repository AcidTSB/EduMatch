package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.components.FooterSectionRegister
// Import các components mới
import com.example.edumatch_androi.ui.components.home.*
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.edumatch_androi.ui.components.home.CustomHeaderRow
import kotlinx.coroutines.coroutineScope
import kotlin.coroutines.coroutineContext
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch


@OptIn(ExperimentalMaterial3Api::class) // Thêm annotation này cho Scaffold
@Composable
fun HomeScreen(
    navController: NavController,
    // Lấy ViewModel để kiểm tra trạng thái và thông tin user
    dashboardViewModel: DashboardViewModel = viewModel()
) {
    val scrollState = rememberScrollState()
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 100.dp else 24.dp // Padding rộng hơn cho Home


    // Lấy trạng thái đăng nhập (Giả sử bạn có biến này trong ViewModel)
    // Hiện tại, chúng ta sẽ giả định người dùng đã đăng nhập nếu username không rỗng
    val user = dashboardViewModel.currentUser
    val isLoggedIn = user.uid.isNotBlank() // true nếu user đã đăng nhập

    // Thêm coroutineScope cho việc điều hướng sau khi đăng xuất
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            // ✅ LOGIC ĐIỀU KIỆN HÓA HEADER
            if (isLoggedIn) {
                // NẾU ĐÃ ĐĂNG NHẬP: Dùng Header cá nhân hóa
                DashboardHeader(
                    userName = user.displayName, // Dùng tên user thật
                    userEmail = user.userEmail,
                    role = user.role,
                    screenWidth = screenWidth,
                    onSignOutClicked = {
                        dashboardViewModel.signOut {
                            coroutineScope.launch {
                                navController.navigate("home_route") {
                                    // Xóa Back Stack, nhưng popUpTo Home (để Home là màn hình duy nhất)
                                    popUpTo("home_route") { inclusive = true }
                                }
                            }
                        }
                    },
                    onHomeClicked = { navController.navigate("home_route") },
                    onDashboardClicked = { navController.navigate("dashboard_route") },
                    onScholarshipsClicked = { navController.navigate("scholarships_route") },
                    onApplicationsClicked = { navController.navigate("applications_route") },
                    onMessagesClicked = { navController.navigate("messages_route") },
                    activeScreen = "Home"
                )
            } else {
                // NẾU CHƯA ĐĂNG NHẬP: Dùng Header công khai (có Sign In/Sign Up)
                CustomHeaderRow(
                    navController = navController, // <<< THÊM NAV CONTROLLER
                    onNavigateToRegister = { navController.navigate("register_route") },
                    onSignInClicked = { navController.navigate("login_route") },
                    activeScreen = "home_route" // BÁO CHO HEADER BIẾT ĐANG Ở MÀN HOME
                )
            }
        },
        containerColor = Color(0xFFFAFAFA) // Background xám nhạt
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            // Nội dung chính

            // 1. HERO SECTION (Header lớn) - Dùng padding riêng
            HeroSection(navController = navController, screenWidth = screenWidth, isLoggedIn = isLoggedIn)

            // 2. WHY CHOOSE EDUMATCH? (Features)
            WhyChooseSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 3. STATS SECTION (4 Stats)
            HomeStatsSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 4. HOW IT WORKS (3 Steps)
            HowItWorksSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 5. CTA FOOTER
            CtaFooterSection(horizontalPadding = horizontalPadding, navController = navController, isLoggedIn = isLoggedIn)

            // 6. FOOTER CHUNG
            FooterSectionRegister()
        }
    }
}