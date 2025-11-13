package com.example.edumatch_androi.ui.components.scholarship

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.data.model.ScholarshipStat
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import androidx.compose.foundation.layout.ExperimentalLayoutApi

@Composable
fun ScholarshipsHeader() {
    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Find Your Perfect Scholarship", fontSize = 32.sp, fontWeight = FontWeight.SemiBold, color = DarkText, textAlign = TextAlign.Center)
        Text("Discover scholarships tailored to your academic profile and career goals. Over 2,000+ opportunities from leading institutions worldwide.", fontSize = 16.sp, color = TextGray, textAlign = TextAlign.Center)
    }
}

// Stats Grid (4 cột trên Desktop, 2x2 trên Mobile)
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ScholarshipsStatsGrid(stats: List<ScholarshipStat>, screenWidth: Int) {
    val isMobile = screenWidth < 600

    if (isMobile) {
        // Bố cục 2x2 cho Mobile
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            maxItemsInEachRow = 2
        ) {
            stats.forEach { stat ->
                StatItem(stat.count, stat.label, Modifier.weight(1f))
            }
        }
    } else {
        // Bố cục 1x4 cho Desktop
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
            stats.forEach { stat ->
                StatItem(stat.count, stat.label, Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun StatItem(count: String, label: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(vertical = 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(count, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp, color = Color.Blue) // Màu xanh dương
        Spacer(Modifier.height(4.dp))
        Text(label, fontSize = 14.sp, color = TextGray, textAlign = TextAlign.Center)
    }
}