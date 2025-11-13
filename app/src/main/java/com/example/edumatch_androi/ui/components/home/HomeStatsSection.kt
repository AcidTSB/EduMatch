package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.MonetizationOn
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

@Composable
fun HomeStatsSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 24.dp)
    ) {
        if (isMobile) {
            // Bố cục 2x2 cho Mobile
            Column(verticalArrangement = Arrangement.spacedBy(32.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                    LargeStatItem(Icons.Default.MonetizationOn, "1000+", "Active Scholarships")
                    LargeStatItem(Icons.Default.People, "5000+", "Students Matched")
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                    LargeStatItem(Icons.Default.School, "200+", "Partner Universities")
                    LargeStatItem(Icons.Default.Star, "95%", "Success Rate")
                }
            }
        } else {
            // Bố cục 1x4 cho Desktop
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                LargeStatItem(Icons.Default.MonetizationOn, "1000+", "Active Scholarships", Modifier.weight(1f))
                LargeStatItem(Icons.Default.People, "5000+", "Students Matched", Modifier.weight(1f))
                LargeStatItem(Icons.Default.School, "200+", "Partner Universities", Modifier.weight(1f))
                LargeStatItem(Icons.Default.Star, "95%", "Success Rate", Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun LargeStatItem(icon: ImageVector, count: String, label: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(icon, contentDescription = null, tint = Color.Blue, modifier = Modifier.size(36.dp))
        Spacer(Modifier.height(8.dp))
        Text(count, fontWeight = FontWeight.Bold, fontSize = 24.sp, color = DarkText)
        Spacer(Modifier.height(4.dp))
        Text(label, fontSize = 14.sp, color = TextGray)
    }
}