package com.example.edumatch_androi.ui.components.scholarship

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.DarkText
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.ExperimentalLayoutApi


@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ActiveFiltersBar(activeFilters: List<String>) {
    if (activeFilters.isEmpty()) return

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Active Filters ${activeFilters.size}", color = TextGray)

        // Dùng FlowRow cho các Chip (trên mobile sẽ tự xuống hàng)
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.weight(1f)) {
            activeFilters.forEach { filter ->
                FilterChip(label = filter, onClick = { /* Xóa filter */ })
            }
            if (activeFilters.isNotEmpty()) {
                TextButton(onClick = { /* Clear All */ }) {
                    Text("Clear All", color = Color.Red, fontSize = 14.sp)
                }
            }
        }
    }
}

// Chip cho Filter
@Composable
fun FilterChip(label: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .border(BorderStroke(1.dp, Color(0xFFE5E5E5)), RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 6.dp)
            .height(30.dp)
            .background(Color.White),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, fontSize = 14.sp, color = DarkText)
        Spacer(Modifier.width(8.dp))
        Icon(Icons.Default.Close, contentDescription = "Close", modifier = Modifier.size(16.dp).clickable(onClick = onClick), tint = TextGray)
    }
}