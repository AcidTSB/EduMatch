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
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.* // Import tất cả components mới
import com.example.edumatch_androi.ui.viewmodel.MessagesViewModel // ViewModel mới
import androidx.compose.ui.graphics.Color
import com.example.edumatch_androi.ui.components.message.MessageHeaderSection
import com.example.edumatch_androi.ui.components.message.SearchAndFilterBar
import com.example.edumatch_androi.ui.components.message.MessagesAndContactsSection
import com.example.edumatch_androi.ui.components.message.MessageStatsSection
import com.example.edumatch_androi.ui.components.FooterSectionRegister

@Composable
fun MessagesScreen(
    navController: NavController,
    viewModel: MessagesViewModel = viewModel()
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp

    Scaffold(
        topBar = {
            DashboardHeader(
                userName = "John Doe", // Thay bằng user thật
                screenWidth = screenWidth,
                onHomeClicked = { navController.navigate("dashboard_route") },
                onDashboardClicked = { navController.navigate("dashboard_route") },
                onScholarshipsClicked = { navController.navigate("scholarships_route") },
                onApplicationsClicked = { navController.navigate("applications_route") },
                onMessagesClicked = { navController.navigate("messages_route") }
            )
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
            MessageStatsSection(viewModel.messageStats, screenWidth)
            Spacer(Modifier.height(32.dp))

            // 4. KHỐI CHIA 2 CỘT (Đã chuyển thành bố cục dọc)
            MessagesAndContactsSection(
                screenWidth = screenWidth,
                messages = viewModel.recentMessages, // Giả định có
                contacts = viewModel.quickContacts // Giả định có
            )
            Spacer(Modifier.height(80.dp))

            // 5. FOOTER
            FooterSectionRegister()
        }
    }
}