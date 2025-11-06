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