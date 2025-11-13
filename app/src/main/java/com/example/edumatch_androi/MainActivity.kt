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
import com.example.edumatch_androi.ui.screens.HomeScreen
import com.example.edumatch_androi.ui.screens.MessagesScreen
import com.example.edumatch_androi.ui.screens.DashboardRegisterWrapper
import com.google.firebase.auth.FirebaseAuth
import com.example.edumatch_androi.ui.screens.ScholarshipsScreen
import com.example.edumatch_androi.ui.screens.AboutScreen
import com.example.edumatch_androi.ui.screens.PricingScreen
import com.example.edumatch_androi.ui.screens.ContactScreen


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        FirebaseAuth.getInstance().signOut()
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
            startDestination = "home_route"
        ) {
            // --- 1. LOGIN SCREEN ---
            composable("login_route") {
                LoginScreen(
                    navController = navController,
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
                    navController = navController, // ✅ Thêm tham số bắt buộc
                    onNavigateBack = {
                        navController.popBackStack()
                    },
                    modifier = Modifier
                )
            }

            // --- 3. DASHBOARD SCREEN (ĐÍCH ĐẾN CHÍNH) ---
            // ✅ Đổi tên Route Dashboard thành "dashboard_route"
            composable("dashboard_route") {
                DashboardScreen(
                    navController = navController,
                    onHomeClicked = { navController.navigate("home_route") },
                    onDashboardClicked = { /* Đang ở Dashboard */ },
                    onApplicationsClicked = { navController.navigate("applications_route") },
                    onScholarshipsClicked = { navController.navigate("scholarships_route") },
                    onMessagesClicked = { navController.navigate("messages_route") },
                    onViewDetailsClicked = { id -> navController.navigate("scholarship_details_route/$id") },
                    onApplyClicked = { id -> navController.navigate("apply_route/$id") }
                )
            }

            // --- 4. CÁC ĐÍCH ĐẾN MỚI TỪ DASHBOARD (ROUTES BỊ THIẾU) ---

            // My Home
            composable("home_route") {
                HomeScreen(navController = navController)
            }

            //  MY APPLICATIONS SCREEN
            composable("applications_route") {
                // Thay thế Text bằng Composable Screen thực tế
                ApplicationsScreen(navController = navController)
            }

            // ✅ scholarships_route
            composable("scholarships_route") {
                ScholarshipsScreen(navController = navController)
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

            // --- ĐĂNG KÝ SAU KHI LOGIN (Header Dashboard) ---
            composable("register_flow_route") {
                // Chúng ta sẽ tạo một wrapper screen để giả lập việc hiển thị DashboardHeader
                DashboardRegisterWrapper(navController = navController)
            }


            // Thêm route cho việc ứng tuyển (ví dụ từ nút Apply)
            composable(
                route = "apply_route/{fellowshipId}",
                arguments = listOf(navArgument("fellowshipId") { type = NavType.StringType })
            ) { backStackEntry ->
                val fellowshipId = backStackEntry.arguments?.getString("fellowshipId")
                Text("Apply Screen for ID: $fellowshipId")
            }

            // ✅ ABOUT SCREEN: THÊM ROUTE NÀY VÀO NAVGRAPH
            composable("about_route") {
                AboutScreen(navController = navController)
            }

            // Pricing screen;
            composable("pricing_route") {
                PricingScreen(navController = navController)
            }

            // Contact screen;
            composable("contact_route") {
                ContactScreen(navController = navController)
            }
        }
    }
}