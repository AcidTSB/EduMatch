@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.components.FooterSectionRegister
import com.example.edumatch_androi.ui.components.home.CustomHeaderRow
import com.example.edumatch_androi.ui.components.about.* // Import components About mới
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.graphics.Color


@Composable
fun AboutScreen(navController: NavController, dashboardViewModel: DashboardViewModel = viewModel()) {
    val scrollState = rememberScrollState()
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 100.dp else 24.dp

    val user = dashboardViewModel.currentUser
    val isLoggedIn = user.uid.isNotBlank()
    val coroutineScope = rememberCoroutineScope()


    Scaffold(
        topBar = {
            // Logic Header có điều kiện
            if (isLoggedIn) {
                DashboardHeader(
                    userName = user.displayName,
                    userEmail = user.userEmail,
                    role = user.role,
                    screenWidth = screenWidth,
                    activeScreen = "About", // Đánh dấu About là active
                    onHomeClicked = { navController.navigate("home_route") },
                    onDashboardClicked = { navController.navigate("dashboard_route") },
                    onScholarshipsClicked = { navController.navigate("scholarships_route") },
                    onApplicationsClicked = { navController.navigate("applications_route") },
                    onMessagesClicked = { navController.navigate("messages_route") },
                    onSignOutClicked = {
                        dashboardViewModel.signOut {
                            coroutineScope.launch {
                                navController.navigate("home_route") { popUpTo("home_route") { inclusive = true } }
                            }
                        }
                    }
                )
            } else {
                CustomHeaderRow(
                    navController = navController, // TRUYỀN NAVCONTROLLER VÀO
                    activeScreen = "about_route",     // BÁO CHO HEADER BIẾT ĐANG Ở MÀN ABOUT
                    onNavigateToRegister = { navController.navigate("register_route") },
                    onSignInClicked = { navController.navigate("login_route") }
                )
            }
        },
        containerColor = Color(0xFFFAFAFA)
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            // 1. INTRO VÀ THỐNG KÊ
            AboutIntroSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 2. OUR STORY & MISSION
            StoryMissionSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 3. OUR VALUES
            OurValuesSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 4. OUR TEAM
            OurTeamSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 5. CTA FOOTER (Tái sử dụng logic điều hướng từ HomeScreen)
            AboutCtaFooter(navController = navController, isLoggedIn = isLoggedIn)

            // 6. FOOTER CHUNG
            FooterSectionRegister()
        }
    }
}