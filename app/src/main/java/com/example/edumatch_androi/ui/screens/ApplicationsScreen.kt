@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

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
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.components.DashboardHeader
import com.example.edumatch_androi.ui.components.StatCard
import com.example.edumatch_androi.ui.viewmodel.DashboardViewModel
// ✅ Đảm bảo các imports sau có thể truy cập được:
// import com.example.edumatch_androi.ui.theme.* // import com.example.edumatch_androi.data.model.ApplicationStat // Cần cho StatCard
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.data.model.ApplicationStat
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.filled.ArrowDropDown
import com.example.edumatch_androi.data.model.Application
import androidx.compose.material.icons.filled.Description
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.pointer.motionEventSpy
import com.example.edumatch_androi.ui.components.FooterSectionRegister
import com.example.edumatch_androi.ui.components.StatsSection

@Composable
fun ApplicationsScreen(
    navController: NavController,
    viewModel: DashboardViewModel = viewModel()
) {
    val scrollState = rememberScrollState()
    val screenWidth = LocalConfiguration.current.screenWidthDp
    val horizontalPadding = if (screenWidth > 600) 80.dp else 16.dp

    val user = viewModel.currentUser
    val appStats = viewModel.stats
    val recentApplications = viewModel.recentApplications
//    val recentApplications = emptyList<Application>() // Dòng mới: ép buộc danh sách rỗng

    // Sửa lỗi: Tạo state cho Dropdown Status
    var statusExpanded by remember { mutableStateOf(false) }
    val statuses = listOf("All Status", "Submitted", "Under Review", "Accepted", "Rejected")
    var selectedStatus by remember { mutableStateOf(statuses.first()) }

    Scaffold(
        topBar = {
            DashboardHeader(
                userName = user.displayName,
                screenWidth = screenWidth,
                onHomeClicked = { navController.navigate("dashboard_route") },
                onDashboardClicked = { navController.navigate("dashboard_route") },
                onScholarshipsClicked = { navController.navigate("scholarships_route") },
                // ✅ SỬA LỖI: Cung cấp hành động điều hướng cho Applications
                onApplicationsClicked = { navController.navigate("applications_route") },
                onMessagesClicked = { navController.navigate("messages_route") }
            )
        },
        containerColor = Color(0xFFFAFAFA) // Light Gray Background
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = horizontalPadding, vertical = 32.dp)
        ) {
            // 1. HEADER CHÍNH
            Text("My Applications", fontSize = 32.sp, fontWeight = FontWeight.SemiBold, color = DarkText)
            Text("Track your scholarship applications and their status", fontSize = 16.sp, color = TextGray)
            Spacer(Modifier.height(32.dp))

            // 2. STATS CARDS (5 Thẻ - Dùng FlowRow hoặc Logic chia)
            ApplicationsStatsSection(appStats, screenWidth)
            Spacer(Modifier.height(40.dp))

            // 3. SEARCH & DROPDOWN ROW
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Search Input Field
                OutlinedTextField(
                    value = "",
                    onValueChange = { /* TODO */ },
                    label = { Text("Search applications...") },
                    leadingIcon = { Icon(Icons.Default.Search, null) },
                    modifier = Modifier.weight(1f).padding(end = 16.dp),
                    shape = RoundedCornerShape(8.dp)
                )

                // Status Dropdown (Đã hoàn thiện)
                Box {
                    TextButton(onClick = { statusExpanded = true }) {
                        Text(selectedStatus, color = TextGray)
                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = TextGray)
                    }
                    DropdownMenu(
                        expanded = statusExpanded,
                        onDismissRequest = { statusExpanded = false }
                    ) {
                        statuses.forEach { status ->
                            DropdownMenuItem(
                                text = { Text(status) },
                                onClick = {
                                    selectedStatus = status
                                    statusExpanded = false
                                }
                            )
                        }
                    }
                }
            }
            Spacer(Modifier.height(32.dp))

            // 4. APPLICATIONS LIST / NO APPLICATIONS YET
            ApplicationsListSection(recentApplications, onBrowseClicked = { navController.navigate("scholarships_route") })

            Spacer(Modifier.height(80.dp))

            // 5. FOOTER (Gọi hàm Placeholder để tránh lỗi "Unresolved Reference")
            FooterSectionRegister()
        }
    }
}


// --- HÀM PLACEHOLDER CHO CÁC COMPONENTS CHÍNH ---

// ✅ PHẢI CÓ HÀM NÀY ĐỂ KHỐI 4 GỌI ĐƯỢC NÚT BROWSE
@Composable
fun ApplicationsListSection(applications: List<Application>, onBrowseClicked: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().height(400.dp),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, Color(0xFFE5E5E5)),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        if (applications.isEmpty()) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(Icons.Default.Description, contentDescription = null, tint = TextGray.copy(alpha = 0.3f), modifier = Modifier.size(48.dp))
                Spacer(Modifier.height(16.dp))
                Text("No applications found", color = DarkText, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Text("You haven't submitted any applications yet.", color = TextGray, fontSize = 14.sp)
                Spacer(Modifier.height(16.dp))
                // ✅ NÚT BROWSE ĐÃ HOÀN THIỆN VÀ GỌI CALLBACK
                Button(onClick = onBrowseClicked) {
                    Text("Browse Scholarships")
                }
            }
        } else {
            // TODO: Hiển thị LazyColumn danh sách ứng dụng thực tế
            Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Danh sách ứng dụng ở đây...", color = TextGray)

                // di chuyển để nút xuất hiện kể cả khi có data
                Spacer(Modifier.height(24.dp))
                Button(onClick = onBrowseClicked) {
                    Text("Browse Scholarships")
                }
            }
        }
    }
}


// ✅ PHẢI CÓ HÀM NÀY ĐỂ KHỐI 2 GỌI ĐƯỢC
@Composable
fun ApplicationsStatsSection(stats: List<ApplicationStat>, screenWidth: Int) {
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        StatsSection(stats = stats, screenWidth = screenWidth)
        // ... Thêm 4 StatCard khác
    }
}

// ✅ PHẢI CÓ HÀM NÀY ĐỂ KHỐI 5 GỌI ĐƯỢC
@Composable
fun FooterSectionRegister() {
    // Đây là placeholder để tránh lỗi 'Unresolved reference'
    // Bạn cần đảm bảo đã copy/import hàm này từ file RegisterScreen.kt vào.
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 40.dp)) {
        Text("Footer Placeholder", color = TextGray)
    }
}