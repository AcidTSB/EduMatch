package com.example.edumatch_androi.ui.components.contact

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.material3.CardDefaults

@Composable
fun SupportBlocksSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("How Can We Help?", fontSize = 24.sp, fontWeight = FontWeight.SemiBold, color = DarkText)
        Text("Choose the best way to reach us", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(32.dp))

        // 3 Thẻ hỗ trợ (Responsive 1 cột/3 cột)
        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                SupportCard(Icons.Default.Email, "Email Support", "Get help via email", "support@edumatch.com", "Response within 24 hours", Color(0xFFE6F0FF))
                SupportCard(Icons.Default.Phone, "Phone Support", "Speak with our team", "+1 (555) 123-4567", "Mon-Fri 9AM-5PM PST", Color(0xFFE6FFEE))
                SupportCard(Icons.Default.Chat, "Live Chat", "Chat with us in real-time", "Available on website", "Mon-Fri 9AM-5PM PST", Color(0xFFFFF0F5))
            }
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                SupportCard(Icons.Default.Email, "Email Support", "Get help via email", "support@edumatch.com", "Response within 24 hours", Color(0xFFE6F0FF), Modifier.weight(1f))
                SupportCard(Icons.Default.Phone, "Phone Support", "Speak with our team", "+1 (555) 123-4567", "Mon-Fri 9AM-5PM PST", Color(0xFFE6FFEE), Modifier.weight(1f))
                SupportCard(Icons.Default.Chat, "Live Chat", "Chat with us in real-time", "Available on website", "Mon-Fri 9AM-5PM PST", Color(0xFFFFF0F5), Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun SupportCard(icon: ImageVector, title: String, tagline: String, contact: String, hours: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.height(200.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = color)
    ) {
        Column(modifier = Modifier.padding(20.dp).fillMaxWidth()) {
            Icon(icon, contentDescription = null, tint = EduMatchBlue, modifier = Modifier.size(32.dp))
            Spacer(Modifier.height(8.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText)
            Spacer(Modifier.height(4.dp))
            Text(tagline, fontSize = 14.sp, color = TextGray)
            Spacer(Modifier.height(16.dp))
            Text(contact, fontSize = 14.sp, color = EduMatchBlue, fontWeight = FontWeight.SemiBold)
            Text(hours, fontSize = 12.sp, color = TextGray)
        }
    }
}