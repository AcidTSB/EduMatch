package com.example.edumatch_androi.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Article
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.BorderGray
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.CardBackgroundLight


@Composable
fun QuickActionsSection() {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text("Quick Actions", fontWeight = FontWeight.SemiBold, fontSize = 20.sp, color = DarkText)
        Spacer(Modifier.height(16.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            QuickActionItem(Icons.Outlined.PersonOutline, "Update Profile")
            QuickActionItem(Icons.Default.Search, "Browse Scholarships")
            QuickActionItem(Icons.Outlined.Article, "My Applications")
            QuickActionItem(Icons.Outlined.Settings, "Settings")
        }
    }
}

@Composable
fun QuickActionItem(icon: ImageVector, title: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.clickable { /* TODO */ }) {
        Surface(
            modifier = Modifier.size(64.dp),
            shape = CircleShape,
            color = CardBackgroundLight,
            border = BorderStroke(1.dp, BorderGray)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = title, modifier = Modifier.size(36.dp), tint = EduMatchBlue)
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(title, color = DarkText, fontSize = 14.sp, fontWeight = FontWeight.Medium)
    }
}