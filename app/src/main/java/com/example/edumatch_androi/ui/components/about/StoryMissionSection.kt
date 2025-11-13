package com.example.edumatch_androi.ui.components.about

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import androidx.compose.material3.CardDefaults

@Composable
fun StoryMissionSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp)
    ) {
        Text("Our Story", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = DarkText)
        Spacer(Modifier.height(24.dp))

        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(32.dp)) {
                StoryContent()
                MissionCard(Modifier.fillMaxWidth())
            }
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(40.dp)) {
                StoryContent(Modifier.weight(2f))
                MissionCard(Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun StoryContent(modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(
            "EduMatch was born from a simple observation: too many talented students miss out on educational opportunities simply because they don't know they exist.",
            fontSize = 16.sp, color = TextGray
        )
        Spacer(Modifier.height(16.dp))
        Text(
            "Our founder, Dr. Sarah Wilson, experienced this firsthand during her PhD journey. Despite being highly qualified, she spent countless hours manually searching through hundreds of scholarship databases, often missing deadlines or discovering relevant opportunities too late.",
            fontSize = 16.sp, color = TextGray
        )
        Spacer(Modifier.height(16.dp))
        Text(
            "We realized that technology could solve this problem. By leveraging artificial intelligence and machine learning, we could create a platform that automatically matches students with the most relevant opportunities based on their background, interests, and goals.",
            fontSize = 16.sp, color = TextGray
        )
        Spacer(Modifier.height(16.dp))
        Text(
            "Today, EduMatch has helped over 50,000 students find and secure educational funding, representing more than $500 million in total awards.",
            fontSize = 16.sp, color = DarkText, fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun MissionCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color(0xFFE6F0FF)) // Light Blue
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color.Blue, modifier = Modifier.size(36.dp))
            Spacer(Modifier.height(16.dp))
            Text("Our Mission", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
            Spacer(Modifier.height(8.dp))
            Text("To make quality education accessible to everyone by connecting students with the right opportunities at the right time.", fontSize = 16.sp, color = TextGray)
        }
    }
}