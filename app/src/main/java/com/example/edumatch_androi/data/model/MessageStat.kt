package com.example.edumatch_androi.data.model

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

data class MessageStat (
    val title: String,
    val count: Int,
    val icon: ImageVector,
    val color: Color,
    val description: String? = null // Dùng cho Real-time Status
)