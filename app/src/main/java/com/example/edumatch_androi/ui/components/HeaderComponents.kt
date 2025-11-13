package com.example.edumatch_androi.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalDensity
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.RedAccent



@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardHeader(
    userName: String,
    userEmail: String,
    role: String,
    screenWidth: Int,
    // nhận biết màn nào đang active
    activeScreen: String,
    onHomeClicked: () -> Unit,
    onDashboardClicked: () -> Unit,
    onScholarshipsClicked: () -> Unit,
    onApplicationsClicked: () -> Unit,
    onMessagesClicked: () -> Unit,
    onSignOutClicked: () -> Unit = {}
) {
    // 1. SETUP SCROLL STATE & DENSITY
    val scrollState = rememberScrollState()
    val density = LocalDensity.current

    // 2. LOGIC TỰ ĐỘNG CUỘN (Giữ nguyên)
    LaunchedEffect(screenWidth) {
        if (screenWidth <= 600) {
            with(density) {
                val scrollOffset = 120.dp.toPx().toInt()
                scrollState.animateScrollTo(scrollOffset)
            }
        } else {
            scrollState.scrollTo(0)
        }
    }

    Surface(
        shadowElevation = 1.dp,
        color = Color.White,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = if (screenWidth > 600) 40.dp else 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 1. Logo (Fixed Width)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    modifier = Modifier.size(32.dp),
                    shape = RoundedCornerShape(8.dp),
                    color = EduMatchBlue
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(Modifier.width(8.dp))
//                Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
            }

            // 2. Navbar Links (ScrollView - Chiếm hết không gian còn lại)
            // ✅ SỬ DỤNG WEIGHT(1F) CHO VÙNG SCROLL ĐỂ NÓ CHIẾM HẾT VÀ BỊ ÉP CUỘN, KHÔNG BỊ ÉP CO LẠI BỞI CHÍNH NỘI DUNG CỦA NÓ.
            Row(
                modifier = Modifier
                    .weight(1f) // Chiếm phần lớn không gian giữa Logo và UserInfo
                    // Tăng khoảng cách từ Logo
                    .padding(start = if (screenWidth > 600) 40.dp else 16.dp)
                    .horizontalScroll(scrollState),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NavBarItem("Home", isActive = activeScreen == "Home", onClick = onHomeClicked)
                NavBarItem("Dashboard",isActive = activeScreen == "Dashboard", onClick = onDashboardClicked)
                NavBarItem("Scholarships",isActive = activeScreen == "Scholarships", onClick = onScholarshipsClicked)
                NavBarItem("Applications",isActive = activeScreen == "Applications", onClick = onApplicationsClicked)
                NavBarItem("Messages", isActive = activeScreen == "Messages", onClick = onMessagesClicked)

                // Thêm padding cuối để cuộn thoải mái
                Spacer(Modifier.width(16.dp))
            }

            // 3. User Info & Dropdown (Fixed Width)
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { /* TODO */ }) { Icon(Icons.Outlined.Search, contentDescription = "Search", tint = TextGray) }
                IconButton(onClick = { /* TODO */ }) { Icon(Icons.Default.Notifications, contentDescription = "Notifications", tint = TextGray) }

                Spacer(Modifier.width(8.dp))
                VerticalDivider(modifier = Modifier.height(24.dp), color = BorderGray)
                Spacer(Modifier.width(8.dp))

                UserInfoDropdown(
                    userName = userName,
                    userEmail = userEmail,
                    role = role,
                    isMobile = screenWidth <= 600,
                    onSignOutClicked = onSignOutClicked
                )
            }
        }
    }
}

@Composable
fun NavBarItem(title: String, isActive: Boolean = false, onClick: () -> Unit) {
    TextButton(
        onClick = onClick,
        colors = ButtonDefaults.textButtonColors(
            contentColor = if (isActive) EduMatchBlue else TextGray
        )
    ) {
        // TẠO KHOẢNG ĐỆM NỘI BỘ CHO NÚT TEXTBUTTON
        Text(
            title,
            fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal,
            fontSize = 15.sp,
            modifier = Modifier.padding(horizontal = 4.dp) // Thêm padding ngang nhẹ
        )
    }
}

// --- USER INFO DROPDOWN (Giữ nguyên) ---
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserInfoDropdown(
    userName: String,
    userEmail: String,
    role: String,
    isMobile: Boolean,
    onSignOutClicked: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    val initials = userName.split(" ").mapNotNull { it.firstOrNull()?.uppercaseChar() }.take(2).joinToString("")
    val toggleMenu = { expanded = !expanded }

    Box {
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color.White)
                .padding(vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(0.dp)
        ) {

            // 1. VÙNG TÊN/INITIALS (Vùng click thứ nhất)
            Row(
                modifier = Modifier
                    .clickable(onClick = toggleMenu)
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (isMobile) {
                    Surface(
                        modifier = Modifier.size(32.dp),
                        shape = CircleShape,
                        color = EduMatchBlue.copy(alpha = 0.1f)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(initials.ifEmpty { "JD" }, color = EduMatchBlue, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                } else {
                    Text(userName, color = DarkText, fontWeight = FontWeight.Medium, fontSize = 14.sp, modifier = Modifier.padding(start = 4.dp))
                }

                if (!isMobile) {
                    Text(role, color = TextGray, fontSize = 12.sp, modifier = Modifier.padding(start = 4.dp))
                }
            }

            // 3. VÙNG MŨI TÊN DROPDOWN (Vùng click thứ hai)
            IconButton(onClick = toggleMenu) {
                Icon(Icons.Default.ArrowDropDown, contentDescription = "Dropdown", tint = DarkText)
            }
        }

        // DROPDOWN MENU
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = toggleMenu
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                Text(userName, fontWeight = FontWeight.Bold, color = DarkText, fontSize = 16.sp)
                Text(userEmail, color = TextGray, fontSize = 13.sp)
                Divider(Modifier.padding(vertical = 8.dp))
            }

            DropdownMenuItem(
                text = { Text("Update Profile", color = DarkText) },
                onClick = { expanded = false; /* TODO: Điều hướng Profile */ },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = DarkText) }
            )
            DropdownMenuItem(
                text = { Text("Settings", color = DarkText) },
                onClick = { expanded = false; /* TODO: Điều hướng Settings */ },
                leadingIcon = { Icon(Icons.Default.Settings, contentDescription = null, tint = DarkText) }
            )
            Divider()
            DropdownMenuItem(
                text = { Text("Sign Out", color = RedAccent, fontWeight = FontWeight.SemiBold) },
                onClick = { expanded = false; onSignOutClicked() }
            )
        }
    }
}