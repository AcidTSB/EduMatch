package com.example.edumatch_androi.ui.components.about

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import androidx.compose.material3.CardDefaults

@Composable
fun OurValuesSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF7F9FC)) // Rất nhạt, gần như trắng
            .padding(horizontal = horizontalPadding, vertical = 64.dp)
    ) {
        Text("Our Values", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.Blue)
        Text("The principles that guide everything we do at EduMatch.", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(40.dp))

        // Bố cục 2x2 Responsive
        Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
            if (isMobile) {
                // Mobile: 1 cột
                ValueItem(Icons.Default.Accessibility, "Accessibility", "Making education opportunities accessible to all students regardless of background.", Color(0xFFE6F0FF))
                ValueItem(Icons.Default.Lightbulb, "Innovation", "Using cutting-edge AI technology to create smarter matching algorithms.", Color(0xFFE6F0FF))
                ValueItem(Icons.Default.Star, "Excellence", "Maintaining the highest standards in everything we do for our users.", Color(0xFFF5E6FF))
                ValueItem(Icons.Default.Group, "Community", "Building a supportive ecosystem for students, providers, and institutions.", Color(0xFFE6F0FF))
            } else {
                // Desktop: 2 cột
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                    ValueItem(Icons.Default.Accessibility, "Accessibility", "Making education opportunities accessible to all students regardless of background.", Color(0xFFE6F0FF), Modifier.weight(1f))
                    ValueItem(Icons.Default.Lightbulb, "Innovation", "Using cutting-edge AI technology to create smarter matching algorithms.", Color(0xFFE6F0FF), Modifier.weight(1f))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                    ValueItem(Icons.Default.Star, "Excellence", "Maintaining the highest standards in everything we do for our users.", Color(0xFFF5E6FF), Modifier.weight(1f))
                    ValueItem(Icons.Default.Group, "Community", "Building a supportive ecosystem for students, providers, and institutions.", Color(0xFFE6F0FF), Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun ValueItem(icon: ImageVector, title: String, description: String, backgroundColor: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = backgroundColor)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Icon(icon, contentDescription = null, tint = Color.Blue, modifier = Modifier.size(24.dp))
            Spacer(Modifier.height(12.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText)
            Spacer(Modifier.height(4.dp))
            Text(description, fontSize = 14.sp, color = TextGray)
        }
    }
}