package com.example.edumatch_androi.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import com.example.edumatch_androi.ui.screens.FooterSectionRegister

private val DarkColorScheme = darkColorScheme(
    primary = Purple80,
    secondary = PurpleGrey80,
    tertiary = Pink80
)

private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40

    /* Other default colors to override
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
    */
)

@Composable
fun Edumatch_androiTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }
      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

    MaterialTheme(
      colorScheme = colorScheme,
      typography = Typography,
      content = content
    )
}



//@file:OptIn(ExperimentalMaterial3Api::class)
//
//package com.example.edumatch_androi.ui.screens
//
//import androidx.compose.foundation.BorderStroke
//import androidx.compose.foundation.layout.*
//import androidx.compose.foundation.rememberScrollState
//import androidx.compose.foundation.verticalScroll
//import androidx.compose.material.icons.Icons
//import androidx.compose.material.icons.filled.Search
//import androidx.compose.material3.*
//import androidx.compose.runtime.*
//import androidx.compose.ui.Alignment
//import androidx.compose.ui.Modifier
//import androidx.compose.ui.text.font.FontWeight
//import androidx.compose.ui.platform.LocalConfiguration
//import androidx.compose.ui.unit.dp
//import androidx.compose.ui.unit.sp
//import androidx.lifecycle.viewmodel.compose.viewModel
//import androidx.navigation.NavController
//import com.example.edumatch_androi.ui.components.* // Import TẤT CẢ các Components
//import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
//import com.example.edumatch_androi.ui.theme.DarkText
//import com.example.edumatch_androi.ui.theme.EduMatchBlue
//import com.example.edumatch_androi.ui.theme.LightGrayBackground
//import com.example.edumatch_androi.ui.theme.TextGray
//import androidx.compose.ui.graphics.Color
//import androidx.compose.runtime.remember
//import androidx.compose.runtime.mutableStateOf
//import androidx.compose.runtime.getValue
//import androidx.compose.runtime.setValue
//
//
//@Composable
//fun DashboardScreen(
//    navController: NavController,
//    viewModel: DashboardViewModel = viewModel()
//) {
//    // ScrollState cho toàn bộ màn hình
//    val scrollState = rememberScrollState()
//
//    val screenWidth = LocalConfiguration.current.screenWidthDp
//
//    // Lấy tất cả các state từ ViewModel
//    val user = viewModel.currentUser
//    val stats = viewModel.stats
//    val recentApplications = viewModel.recentApplications
//    val notifications = viewModel.notifications
//    val recommendedFellowships = viewModel.recommended
//
//    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp
//
//    Scaffold(
//        topBar = {
//            DashboardHeader(
//                userName = user.displayName,
//                screenWidth = screenWidth,
//                onHomeClicked = { /* ... */ },
//                onDashboardClicked = { /* ... */ },
//                onScholarshipsClicked = { navController.navigate("scholarships_route") },
//                onApplicationsClicked = { navController.navigate("applications_route") },
//                onMessagesClicked = { navController.navigate("messages_route") }
//            )
//        },
//        containerColor = LightGrayBackground
//    ) { padding ->
//        Column(
//            modifier = Modifier
//                .padding(padding)
//                .fillMaxSize()
//                .verticalScroll(scrollState) // <-- Scroll chính cho toàn màn hình
//                .padding(horizontal = horizontalPadding, vertical = 32.dp)
//        ) {
//            // 1. WELCOME SECTION
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Column(modifier = Modifier.fillMaxWidth(0.65f)) {
//                    Text(
//                        "Welcome back, ${user.displayName}!",
//                        fontSize = if (screenWidth > 600) 32.sp else 20.sp,
//                        fontWeight = FontWeight.SemiBold,
//                        color = DarkText,
//                        maxLines = 2,
//                        lineHeight = 26.sp
//                    )
//                    Text(
//                        "Here's what's happening with your scholarship applications",
//                        fontSize = if (screenWidth > 600) 16.sp else 14.sp,
//                        color = TextGray,
//                        maxLines = 2
//                    )
//                }
//
//                OutlinedButton(
//                    onClick = { navController.navigate("scholarships_route") },
//                    colors = ButtonDefaults.outlinedButtonColors(contentColor = EduMatchBlue),
//                    border = BorderStroke(1.dp, EduMatchBlue)
//                ) {
//                    Icon(Icons.Default.Search, contentDescription = null, Modifier.size(18.dp))
//                    Spacer(Modifier.width(8.dp))
//                    Text("Find Scholarships")
//                }
//            }
//            Spacer(Modifier.height(40.dp))
//
//            // 2. STATS CARDS
//            StatsSection(stats = stats, screenWidth = screenWidth)
//            Spacer(Modifier.height(48.dp))
//
//            // 3. RECENT APPLICATIONS (Hàng 1 - FULL WIDTH)
//            RecentApplicationsSection(
//                modifier = Modifier.fillMaxWidth().heightIn(min = 380.dp),
//                applications = recentApplications,
//                onFindScholarships = { navController.navigate("scholarships_route") }
//            )
//            Spacer(Modifier.height(48.dp))
//
//            // 4. RECENT NOTIFICATIONS (Hàng 2 - FULL WIDTH)
//            // ✅ ĐỔI TÊN HÀM GỐC VÀ TRUYỀN screenWidth CHO LOGIC 2X2
//            NotificationsSection(
//                modifier = Modifier.fillMaxWidth(),
//                notifications = notifications,
//                screenWidth = screenWidth
//            )
//            Spacer(Modifier.height(48.dp))
//
//
//            // 5. RECOMMENDED SECTION
//            RecommendedSection(
//                fellowships = recommendedFellowships,
//                onViewAllScholarships = { navController.navigate("scholarships_route") },
//                onViewDetailsClicked = { fellowshipId ->
//                    navController.navigate("scholarship_details_route/$fellowshipId")
//                },
//                onApplyClicked = { fellowshipId ->
//                    println("Apply clicked for fellowship ID: $fellowshipId")
//                }
//            )
//            Spacer(Modifier.height(40.dp))
//
//            // 6. QUICK ACTIONS
//            QuickActionsSection()
//            Spacer(Modifier.height(60.dp))
//
//            // 7. FOOTER
//            FooterSectionRegister()
//        }
//    }
//}



// gốc
/*
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

@Composable
fun DashboardScreen(
    navController: NavController,
    viewModel: DashboardViewModel = viewModel()
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
* */


// thay đổi
//package com.example.edumatch_androi.ui.components
//
//
//import androidx.compose.foundation.BorderStroke
//import androidx.compose.foundation.background
//import androidx.compose.foundation.layout.*
//import androidx.compose.foundation.lazy.LazyColumn
//import androidx.compose.foundation.lazy.items
//import androidx.compose.foundation.shape.RoundedCornerShape
//import androidx.compose.material.icons.Icons
//import androidx.compose.material.icons.filled.*
//import androidx.compose.material3.*
//import androidx.compose.runtime.Composable
//import androidx.compose.ui.Alignment
//import androidx.compose.ui.Modifier
//import androidx.compose.ui.graphics.Color
//import androidx.compose.ui.text.font.FontWeight
//import androidx.compose.ui.text.style.TextOverflow
//import androidx.compose.ui.unit.dp
//import androidx.compose.ui.unit.sp
//import com.example.edumatch_androi.data.model.Notification
//import com.example.edumatch_androi.data.model.Application
//import com.example.edumatch_androi.ui.theme.BorderGray
//import com.example.edumatch_androi.ui.theme.EduMatchBlue
//import com.example.edumatch_androi.ui.theme.DarkText
//import com.example.edumatch_androi.ui.theme.TextGray
//import com.example.edumatch_androi.ui.theme.CardBackgroundLight
//import com.example.edumatch_androi.ui.theme.GreenAccent
//import com.example.edumatch_androi.ui.theme.RedAccent
//
//
//
//// --- RECENT APPLICATIONS SECTION (DÙNG LAZYCOLUMN) ---
//@Composable
//fun RecentApplicationsSection(modifier: Modifier = Modifier, applications: List<Application>, onFindScholarships: () -> Unit) {
//    Card(
//        modifier = modifier.heightIn(min = 380.dp),
//        shape = RoundedCornerShape(8.dp),
//        border = BorderStroke(1.dp, BorderGray),
//        colors = CardDefaults.cardColors(containerColor = Color.White),
//        elevation = CardDefaults.cardElevation(0.dp)
//    ) {
//        Column(
//            modifier = Modifier
//                .fillMaxSize()
//                .padding(24.dp)
//        ) {
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Text("Recent Applications", fontWeight = FontWeight.SemiBold, fontSize = 18.sp, color = DarkText)
//                if (applications.isNotEmpty()) {
//                    TextButton(onClick = { /* View All */ }) {
//                        Text("View All →", color = EduMatchBlue)
//                    }
//                }
//            }
//            Spacer(Modifier.height(16.dp))
//
//            if (applications.isEmpty()) {
//                Column(
//                    modifier = Modifier.fillMaxSize(),
//                    horizontalAlignment = Alignment.CenterHorizontally,
//                    verticalArrangement = Arrangement.Center
//                ) {
//                    Icon(Icons.Default.HourglassEmpty, contentDescription = null, tint = TextGray.copy(alpha = 0.3f), modifier = Modifier.size(48.dp))
//                    Spacer(Modifier.height(16.dp))
//                    Text("No applications yet", color = TextGray, fontSize = 16.sp)
//                    Spacer(Modifier.height(16.dp))
//                    Button(
//                        onClick = onFindScholarships,
//                        colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue),
//                        shape = RoundedCornerShape(8.dp)
//                    ) {
//                        Text("Browse Scholarships", color = Color.White)
//                    }
//                }
//            } else {
//                // ✅ DÙNG LAZYCOLUMN CHO HIỆU SUẤT
//                LazyColumn(
//                    modifier = Modifier.fillMaxSize(),
//                    verticalArrangement = Arrangement.spacedBy(12.dp)
//                ) {
//                    items(applications) { application ->
//                        // SỬ DỤNG HÀM CÓ MODIFIER
//                        ApplicationItem(application = application, modifier = Modifier.fillMaxWidth())
//                        Divider(
//                            color = BorderGray.copy(alpha = 0.5f),
//                            thickness = 1.dp
//                        )
//                    }
//                }
//            }
//        }
//    }
//}
//
//// --- NOTIFICATIONS SECTION (DÙNG LAZYCOLUMN + 2X2) ---
//@Composable
//fun NotificationsSection(modifier: Modifier = Modifier, notifications: List<Notification>, screenWidth: Int) {
//    Card(
//        modifier = modifier.fillMaxWidth().heightIn(min = 380.dp),
//        shape = RoundedCornerShape(8.dp),
//        border = BorderStroke(1.dp, BorderGray),
//        colors = CardDefaults.cardColors(containerColor = Color.White),
//        elevation = CardDefaults.cardElevation(0.dp)
//    ) {
//        Column(modifier = Modifier.padding(24.dp)) {
//            Row(
//                modifier = Modifier.fillMaxWidth(),
//                horizontalArrangement = Arrangement.SpaceBetween,
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Text("Recent Notifications", fontWeight = FontWeight.SemiBold, fontSize = 20.sp, color = DarkText)
//                TextButton(onClick = { /* View All */ }) {
//                    Text("View All →", color = EduMatchBlue)
//                }
//            }
//            Spacer(Modifier.height(16.dp))
//
//            // BỐ CỤC 2x2 RESPONSIVE CHO TẤT CẢ THÔNG BÁO
//            val isDesktop = screenWidth > 600
//            val columns = if (isDesktop) 2 else 1
//            val chunkedNotifications = notifications.chunked(columns)
//
//            LazyColumn(
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .heightIn(max = 600.dp),
//                verticalArrangement = Arrangement.spacedBy(16.dp)
//            ) {
//                items(chunkedNotifications) { rowItems ->
//                    Row(
//                        modifier = Modifier.fillMaxWidth(),
//                        horizontalArrangement = Arrangement.spacedBy(16.dp)
//                    ) {
//                        rowItems.forEach { notif ->
//                            // ✅ NotificationItem PHẢI CHẤP NHẬN MODIFIER
//                            NotificationItem(notif, Modifier.weight(1f))
//                        }
//                        // Điền vào chỗ trống
//                        if (rowItems.size == 1 && isDesktop) {
//                            Spacer(modifier = Modifier.weight(1f))
//                        }
//                    }
//                }
//            }
//        }
//    }
//}
//
//@Composable
//fun NotificationItem(notif: Notification, modifier: Modifier = Modifier) { // Cần Modifier
//    Card(
//        modifier = modifier.height(IntrinsicSize.Min),
//        shape = RoundedCornerShape(8.dp),
//        colors = CardDefaults.cardColors(
//            containerColor = if (notif.isAccepted) CardBackgroundLight.copy(alpha = 0.7f) else CardBackgroundLight
//        ),
//        elevation = CardDefaults.cardElevation(0.dp)
//    ) {
//        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
//            // ... (Logic nội dung giữ nguyên)
//        }
//    }
//}
//
//@Composable
//fun ApplicationItem(application: Application, modifier: Modifier = Modifier) { // Cần Modifier
//    Row(
//        modifier = modifier
//            .fillMaxWidth()
//            .padding(vertical = 8.dp),
//        verticalAlignment = Alignment.CenterVertically,
//        horizontalArrangement = Arrangement.SpaceBetween
//    ) {
//        Column(modifier = Modifier.weight(1f)) {
//            // ... (Logic nội dung giữ nguyên)
//        }
//        Spacer(Modifier.width(16.dp))
//        StatusChip(statusText = application.status)
//    }
//}
//
//@Composable
//fun StatusChip(statusText: String) {
//    val (backgroundColor, textColor)
//            = when (statusText) {
//        "Pending" -> Color(0xFFFFF7E6) to Color(0xFFFFAA00)
//        "Accepted" -> Color(0xFFE6F4EA) to GreenAccent
//        "Rejected" -> Color(0xFFFDE8E8) to RedAccent
//        else -> CardBackgroundLight to TextGray
//    }
//
//    Box(
//        modifier = Modifier
//            .background(color = backgroundColor, shape = RoundedCornerShape(16.dp))
//            .padding(horizontal = 12.dp, vertical = 6.dp)
//    ) {
//        Text(
//            text = statusText,
//            color = textColor,
//            fontSize = 12.sp,
//            fontWeight = FontWeight.SemiBold
//        )
//    }
//}



// gốc
/*
package com.example.edumatch_androi.ui.components


import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.Notification
import com.example.edumatch_androi.data.model.Application
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.CardBackgroundLight
import com.example.edumatch_androi.ui.theme.GreenAccent
import com.example.edumatch_androi.ui.theme.RedAccent



@Composable

fun RecentApplicationsSection(modifier: Modifier = Modifier, applications: List<Application>, onFindScholarships: () -> Unit) {
    Card(
        modifier = modifier.height(300.dp),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, BorderGray),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp)

    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Recent Applications", fontWeight = FontWeight.SemiBold, fontSize = 18.sp, color = DarkText)
                if (applications.isNotEmpty()) {
                    TextButton(onClick = { /* View All */ }) {
                        Text("View All →", color = EduMatchBlue)
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            if (applications.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(Icons.Default.HourglassEmpty, contentDescription = null, tint = TextGray.copy(alpha = 0.3f), modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(16.dp))
                    Text("No applications yet", color = TextGray, fontSize = 16.sp)
                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = onFindScholarships,
                        colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Browse Scholarships", color = Color.White)
                    }
                }
            } else {

// TODO: Hiển thị danh sách các ứng dụng thực tế, dùng lazyColumn
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp) // Khoảng cách giữa các item
                ) {
                    items(applications) { application ->
// Gọi Composable để vẽ một item
                        ApplicationItem(application = application)
                        Divider(
                            color = BorderGray.copy(alpha = 0.5f),
                            thickness = 1.dp
                        ) // Thêm đường kẻ
                    }
                }
            }
        }
    }
}

// --- NOTIFICATIONS SECTION ---
@Composable
fun NotificationsSection(modifier: Modifier = Modifier, notifications: List<Notification>) {
    Column(modifier = modifier) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically

        ) {
            Text("Recent Notifications", fontWeight = FontWeight.SemiBold, fontSize = 18.sp, color = DarkText)
            TextButton(onClick = { /* View All */ }) {
                Text("View All →", color = EduMatchBlue)

            }
        }
        Spacer(Modifier.height(16.dp))

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            notifications.forEach { notif ->
                NotificationItem(notif)
            }
        }
    }
}



@Composable
fun NotificationItem(notif: Notification) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (notif.isAccepted) CardBackgroundLight.copy(alpha = 0.7f) else CardBackgroundLight
        ),
        elevation = CardDefaults.cardElevation(0.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
// Icon bên trái
            Icon(
                when {
                    notif.isAccepted -> Icons.Default.CheckCircle
                    notif.isImportant -> Icons.Default.Warning
                    else -> Icons.Default.Info
                },
                contentDescription = null,
                tint = when {
                    notif.isAccepted -> GreenAccent
                    notif.isImportant -> RedAccent
                    else -> EduMatchBlue
                },
                modifier = Modifier.size(24.dp)
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(notif.title, fontWeight = FontWeight.Medium, fontSize = 15.sp, color = DarkText)
                Text(notif.detail, fontSize = 13.sp, color = TextGray, maxLines = 2, overflow = TextOverflow.Ellipsis)
            }
            Spacer(Modifier.width(12.dp))
            Text(notif.date, fontSize = 12.sp, color = TextGray.copy(alpha = 0.8f))
        }
    }
}

@Composable
fun ApplicationItem(application: Application) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = application.title,
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp,
                color = DarkText,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = application.university,
                fontSize = 13.sp,
                color = TextGray
            ) }

        Spacer(Modifier.width(16.dp))
// Hiển thị trạng thái
        StatusChip(statusText = application.status)
    }
}

@Composable
fun StatusChip(statusText: String) {
    val (backgroundColor, textColor)
            = when (statusText) {
        "Pending" -> Color(0xFFFFF7E6) to Color(0xFFFFAA00)
        "Accepted" -> Color(0xFFE6F4EA) to GreenAccent
        "Rejected" -> Color(0xFFFDE8E8) to RedAccent
        else -> CardBackgroundLight to TextGray
    }

    Box(
        modifier = Modifier
            .background(color = backgroundColor, shape = RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(
            text = statusText,
            color = textColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}
* */


// thay đổi
/*
package com.example.edumatch_androi.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edumatch_androi.data.model.Application
import com.example.edumatch_androi.data.model.ApplicationStat
import com.example.edumatch_androi.data.model.CurrentUser
import com.example.edumatch_androi.data.model.Fellowship
import com.example.edumatch_androi.data.model.Notification
import com.example.edumatch_androi.data.repository.DashboardRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.launch

class DashboardViewModel(
    // Trong môi trường thực tế, dùng Hilt để inject Repository
    private val repository: DashboardRepository = DashboardRepository()
) : ViewModel() {

    // --- STATES ĐƯỢC QUAN SÁT BỞI UI ---

    // ✅ BƯỚC 1.1: THÊM STATE ĐỂ THEO DÕI TRẠNG THÁI TẢI DỮ LIỆU
    var isLoading by mutableStateOf(true)
        private set

    var stats by mutableStateOf<List<ApplicationStat>>(emptyList())
        private set
    var notifications by mutableStateOf<List<Notification>>(emptyList())
        private set
    var recommended by mutableStateOf<List<Fellowship>>(emptyList())
        private set
    var recentApplications by mutableStateOf<List<Application>>(emptyList())
        private set

    var currentUser by mutableStateOf(
        CurrentUser(uid = "", displayName = "Guest", userEmail = "", role = "")
    )
        private set

    init {
        // Gộp tất cả logic tải dữ liệu vào một hàm duy nhất
        loadAllData()
    }

    // ✅ BƯỚC 1.2: TẠO HÀM TẢI DỮ LIỆU TỔNG THỂ
    private fun loadAllData() {
        viewModelScope.launch {
            isLoading = true // Bắt đầu tải, bật trạng thái loading

            try {
                // Lấy thông tin user trước (vì nó không phụ thuộc repository)
                fetchUserInfo()

                // Chạy các tác vụ lấy dữ liệu từ repository MỘT CÁCH SONG SONG
                // để tăng hiệu suất.
                val statsJob = async { repository.getApplicationStats().collect { stats = it } }
                val notificationsJob = async { repository.getRecentNotifications().collect { notifications = it } }
                val recommendedJob = async { repository.getRecommendedFellowships().collect { recommended = it } }
                val recentAppsJob = async { repository.getRecentApplications().collect { recentApplications = it } }

                // Đợi tất cả các tác vụ trên hoàn thành
                awaitAll(statsJob, notificationsJob, recommendedJob, recentAppsJob)

            } catch (e: Exception) {
                // Ghi lại lỗi nếu có
                println("Error loading dashboard data: ${e.message}")
            } finally {
                // Dù thành công hay thất bại, luôn tắt trạng thái loading
                isLoading = false
            }
        }
    }

    private fun fetchUserInfo() {
        val firebaseUser = FirebaseAuth.getInstance().currentUser
        if (firebaseUser != null) {
            val userEmail = firebaseUser.email ?: "email@error.com"
            val fetchedDisplayName = firebaseUser.displayName?.takeIf { it.isNotBlank() } ?: userEmail.substringBefore('@')
            val fetchedRole = "Student" // MOCK/GIẢ LẬP ROLE

            currentUser = CurrentUser(
                uid = firebaseUser.uid,
                displayName = fetchedDisplayName,
                userEmail = userEmail,
                role = fetchedRole
            )
        } else {
            currentUser = CurrentUser(uid = "", displayName = "Khách", userEmail = "", role = "Unknown")
        }
    }
}
* */



// gốc
/*

* */