@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

package com.example.edumatch_androi.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.components.FooterSectionRegister
import com.example.edumatch_androi.ui.components.scholarship.*
import com.example.edumatch_androi.ui.viewmodel.ScholarshipsViewModel
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.launch
import androidx.compose.runtime.rememberCoroutineScope
//import androidx.compose.material3.ExperimentalLayoutApi
import com.example.edumatch_androi.ui.components.home.CustomHeaderRow

@Composable
fun ScholarshipsScreen(
    navController: NavController,
    scholarshipsViewModel: ScholarshipsViewModel = viewModel(),
    dashboardViewModel: DashboardViewModel = viewModel()
) {
    val scrollState = rememberScrollState()
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp

    // Lấy thông tin user cho Header và Logic Đăng xuất
    val user = dashboardViewModel.currentUser
    val isLoggedIn = user.uid.isNotBlank()
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            if (isLoggedIn) {
                DashboardHeader(
                    userName = user.displayName,
                    userEmail = user.userEmail,
                    role = user.role,
                    screenWidth = screenWidth,
                    activeScreen = "Scholarships",
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
//                // Header Public Placeholder (Cần định nghĩa PublicHeader nếu màn hình này có thể xem công khai)
//                Text("Public Header Placeholder")
                CustomHeaderRow(
                    navController = navController,
                    activeScreen = "scholarships_route",
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
                .padding(horizontal = horizontalPadding, vertical = 32.dp)
        ) {
            // 1. HEADER CHÍNH
            ScholarshipsHeader()
            Spacer(Modifier.height(32.dp))

            // 2. STATS GRID (4 Thẻ)
            ScholarshipsStatsGrid(scholarshipsViewModel.stats, screenWidth)
            Spacer(Modifier.height(32.dp))

            // 3. SEARCH VÀ ADVANCED FILTER BUTTON
            SearchAndAdvancedFilterBar()
            Spacer(Modifier.height(24.dp))

            // 4. ACTIVE FILTERS VÀ CLEAR BUTTON
            ActiveFiltersBar(scholarshipsViewModel.activeFilters)
            Spacer(Modifier.height(24.dp))

            // 5. FILTER ROWS (Search by field, Levels, Fields, Sort)
            FilterRowsSection(screenWidth)
            Spacer(Modifier.height(32.dp))

            // 6. KẾT QUẢ VÀ DANH SÁCH HỌC BỔNG
            ScholarshipsListSection(
                scholarships = scholarshipsViewModel.scholarships,
                onViewDetailsClicked = { id -> navController.navigate("scholarship_details_route/$id") },
                onApplyClicked = { id -> navController.navigate("apply_route/$id") }
            )

            Spacer(Modifier.height(80.dp))
            FooterSectionRegister()
        }
    }
}

