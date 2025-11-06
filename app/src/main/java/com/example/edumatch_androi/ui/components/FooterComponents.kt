package com.example.edumatch_androi.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.FooterTextGray
import com.example.edumatch_androi.ui.theme.FooterDarkText
import com.example.edumatch_androi.ui.theme.FooterDividerGray
import com.example.edumatch_androi.ui.theme.FooterEduMatchBlue

// Hàm chính Footer đã được thêm Responsive Logic
@Composable
fun FooterSectionRegister() {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    // Điều chỉnh padding cho màn hình hẹp hơn (dưới 600dp)
    val horizontalPadding = if (screenWidth > 600) 100.dp else 16.dp

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = horizontalPadding, vertical = 60.dp)
    ) {
        // Nội dung chính
        if (screenWidth > 600) {
            // 1. Bố cục DESKTOP: 4 Cột ngang
            DesktopFooterContent()
        } else {
            // 2. Bố cục MOBILE: Xếp chồng dọc
            MobileFooterContent()
        }

        Spacer(Modifier.height(18.dp))
        Divider(color = FooterDividerGray)
        Spacer(Modifier.height(20.dp))

        // Bản quyền
        CopyrightSection()
    }
}

// Nội dung Footer cho MÀN HÌNH RỘNG (4 cột ngang)
@Composable
fun DesktopFooterContent() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        // Cột 1: Logo và Mô tả
        Column(modifier = Modifier.weight(1.5f)) {
            FooterLogoAndDescription()
        }
        // Các cột liên kết
        Box(modifier = Modifier.weight(1f)) { FooterColumnRegister("Quick Links", listOf("Home", "About Us", "Browse Scholarships", "Pricing Plans")) }
        Box(modifier = Modifier.weight(1f)) { FooterColumnRegister("Support", listOf("Contact Us", "Help Center", "FAQ", "Privacy Policy", "Terms of Service")) }
        Box(modifier = Modifier.weight(1.5f)) {
            FooterColumnRegister("Get in Touch", listOf("support@edumatch.com", "+1 (555) 123-4567", "123 Education Street", "San Francisco, CA 94105"), hasIcons = true)
        }
    }
}

// Nội dung Footer cho MÀN HÌNH HẸP (Xếp chồng dọc)
@Composable
fun MobileFooterContent() {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(32.dp)) {
        // Cột 1: Logo và Mô tả
        FooterLogoAndDescription()

        // Các cột liên kết xếp chồng
        FooterColumnRegister("Quick Links", listOf("Home", "About Us", "Browse Scholarships", "Pricing Plans"))
        FooterColumnRegister("Support", listOf("Contact Us", "Help Center", "FAQ", "Privacy Policy", "Terms of Service"))
        FooterColumnRegister("Get in Touch", listOf("support@edumatch.com", "+1 (555) 123-4567", "123 Education Street", "San Francisco, CA 94105"), hasIcons = true)
    }
}

@Composable
fun FooterLogoAndDescription() {
    // Logo Footer
    Row(verticalAlignment = Alignment.CenterVertically) {
        Surface(Modifier.size(32.dp), shape = RoundedCornerShape(8.dp), color = FooterEduMatchBlue) {
            Box(contentAlignment = Alignment.Center) {
                Text("E", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
        Spacer(Modifier.width(8.dp))
        Text("EduMatch", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = FooterDarkText)
    }
    Spacer(Modifier.height(8.dp))
    Text(
        "Connecting students with scholarship opportunities and providers with qualified candidates. Making education accessible for everyone.",
        fontSize = 14.sp,
        color = FooterTextGray,
        lineHeight = 20.sp
    )
    // Thêm Social Icons (Để tương đồng với LoginScreen)
    Spacer(Modifier.height(8.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        Icon(Icons.Default.Share, contentDescription = "Twitter", modifier = Modifier.size(18.dp), tint = FooterTextGray)
        Icon(Icons.Default.ThumbUp, contentDescription = "Facebook", modifier = Modifier.size(18.dp), tint = FooterTextGray)
        Icon(Icons.Default.CameraAlt, contentDescription = "Instagram", modifier = Modifier.size(18.dp), tint = FooterTextGray)
        Icon(Icons.Default.Business, contentDescription = "LinkedIn", modifier = Modifier.size(18.dp), tint = FooterTextGray)
    }
}

@Composable
fun CopyrightSection() {
    val screenWidth = LocalConfiguration.current.screenWidthDp
    if (screenWidth > 600) {
        // Bố cục ngang cho Desktop
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("© 2025 EduMatch. All rights reserved.", color = Color(0xFF888888), fontSize = 13.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                Text("Privacy", color = Color(0xFF888888), fontSize = 13.sp)
                Text("Terms", color = Color(0xFF888888), fontSize = 13.sp)
                Text("Contact", color = Color(0xFF888888), fontSize = 13.sp)
            }
        }
    } else {
        // Bố cục dọc cho Mobile
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text("© 2025 EduMatch. All rights reserved.", color = Color(0xFF888888), fontSize = 13.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("Privacy", color = Color(0xFF888888), fontSize = 13.sp)
                Text("Terms", color = Color(0xFF888888), fontSize = 13.sp)
                Text("Contact", color = Color(0xFF888888), fontSize = 13.sp)
            }
        }
    }
}

// Giữ nguyên FooterColumnRegister
@Composable
fun FooterColumnRegister(title: String, items: List<String>, hasIcons: Boolean = false) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = FooterDarkText)
        items.forEachIndexed { index, item ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (hasIcons) {
                    val icon = when (index) {
                        0 -> Icons.Outlined.Email
                        1 -> Icons.Default.Phone
                        else -> Icons.Default.LocationOn
                    }
                    Icon(icon, null, tint = FooterTextGray, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                }
                Text(item, color = FooterTextGray, fontSize = 14.sp)
            }
        }
    }
}