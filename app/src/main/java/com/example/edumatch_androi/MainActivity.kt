package com.example.edumatch_androi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.example.edumatch_androi.ui.screens.LoginScreen
import com.example.edumatch_androi.ui.screens.RegisterScreen
import com.example.edumatch_androi.ui.screens.DashboardScreen
import com.example.edumatch_androi.ui.screens.ApplicationsScreen
import com.example.edumatch_androi.ui.screens.MessagesScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            EduMatchApp()
        }
    }
}

@Composable
fun EduMatchApp() {
    val navController = rememberNavController()

    Surface(color = MaterialTheme.colorScheme.background, modifier = Modifier.fillMaxSize()) {
        NavHost(
            navController = navController,
            startDestination = "login_route"
        ) {
            // --- 1. LOGIN SCREEN ---
            composable("login_route") {
                LoginScreen(
                    onNavigateToRegister = {
                        navController.navigate("register_route")
                    },
                    // ✅ Cập nhật LoginScreen: Điều hướng đến "dashboard_route" và xóa Back Stack.
                    onLoginSuccess = {
                        navController.navigate("dashboard_route") {
                            // Xóa tất cả các màn hình khỏi stack cho đến và bao gồm "login_route"
                            popUpTo("login_route") { inclusive = true }
                        }
                    }
                )
            }

            // --- 2. REGISTER SCREEN ---
            composable("register_route") {
                RegisterScreen(
                    onNavigateBack = {
                        navController.popBackStack()
                    }
                )
            }

            // --- 3. DASHBOARD SCREEN (ĐÍCH ĐẾN CHÍNH) ---
            // ✅ Đổi tên Route Dashboard thành "dashboard_route"
            composable("dashboard_route") {
                DashboardScreen(
                    navController = navController,
                    onHomeClicked = { navController.navigate("dashboard_route") },
                    onDashboardClicked = { /* Đang ở Dashboard */ },
                    onApplicationsClicked = { navController.navigate("applications_route") },
                    onScholarshipsClicked = { navController.navigate("scholarships_route") },
                    onMessagesClicked = { navController.navigate("messages_route") },
                    onViewDetailsClicked = { id -> navController.navigate("scholarship_details_route/$id") },
                    onApplyClicked = { id -> navController.navigate("apply_route/$id") }
                )
            }

            // --- 4. CÁC ĐÍCH ĐẾN MỚI TỪ DASHBOARD (ROUTES BỊ THIẾU) ---

            //  MY APPLICATIONS SCREEN
            composable("applications_route") {
                // Thay thế Text bằng Composable Screen thực tế
                ApplicationsScreen(navController = navController)
            }

            // ✅ scholarships_route
            composable("scholarships_route") {
                Text("Scholarships List Screen")
            }


            // ✅ messages_route
            composable("messages_route") {
                MessagesScreen(navController = navController)
            }

            // ✅ scholarship_details_route/{fellowshipId}
            composable(
                route = "scholarship_details_route/{fellowshipId}",
                arguments = listOf(navArgument("fellowshipId") { type = NavType.StringType })
            ) { backStackEntry ->
                val fellowshipId = backStackEntry.arguments?.getString("fellowshipId")
                Text("Scholarship Details for ID: $fellowshipId")
            }

            // Thêm route cho việc ứng tuyển (ví dụ từ nút Apply)
            composable(
                route = "apply_route/{fellowshipId}",
                arguments = listOf(navArgument("fellowshipId") { type = NavType.StringType })
            ) { backStackEntry ->
                val fellowshipId = backStackEntry.arguments?.getString("fellowshipId")
                Text("Apply Screen for ID: $fellowshipId")
            }
        }
    }
}