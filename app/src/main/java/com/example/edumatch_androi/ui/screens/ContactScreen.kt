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
import com.example.edumatch_androi.ui.components.contact.* // Import components mới
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
import com.example.edumatch_androi.ui.viewmodel.ContactViewModel // ViewModel mới
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.graphics.Color
import com.example.edumatch_androi.ui.theme.LightGrayBackground


@Composable
fun ContactScreen(navController: NavController,
                  dashboardViewModel: DashboardViewModel = viewModel(),
                  contactViewModel: ContactViewModel = viewModel()
) {
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
                    activeScreen = "Contact", // Đánh dấu Contact là active
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
                    navController = navController,
                    activeScreen = "contact_route", // Đánh dấu Contact là active
                    onNavigateToRegister = { navController.navigate("register_route") },
                    onSignInClicked = { navController.navigate("login_route") }
                )
            }
        },
        containerColor = LightGrayBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            // 1. HEADER CHÍNH
            ContactIntroSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 2. SUPPORT BLOCKS (Email, Phone, Live Chat)
            SupportBlocksSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 3. CONTACT FORM & FAQ (CHIA CỘT)
            ContactFormAndFaq(
                screenWidth = screenWidth,
                horizontalPadding = horizontalPadding,
                viewModel = contactViewModel // Truyền ViewModel cho Form
            )

            // 4. OUR OFFICES
            OurOfficesSection(screenWidth = screenWidth, horizontalPadding = horizontalPadding)

            // 5. FOOTER CHUNG
            FooterSectionRegister()
        }
    }
}

