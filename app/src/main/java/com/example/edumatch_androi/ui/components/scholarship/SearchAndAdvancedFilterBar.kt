package com.example.edumatch_androi.ui.components.scholarship

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchAndAdvancedFilterBar() {
    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        // Thanh tìm kiếm chính
        OutlinedTextField(
            value = "",
            onValueChange = { /* TODO */ },
            label = { Text("Search scholarships by name, field, or keyword...", color = TextGray) },
            leadingIcon = { Icon(Icons.Default.Search, null, tint = TextGray) },
            modifier = Modifier.weight(1f).height(50.dp).padding(end = 16.dp),
            shape = RoundedCornerShape(8.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                unfocusedBorderColor = Color(0xFFE5E5E5)
            )
        )

        // Nút Advanced Filters
        Button(
            onClick = { /* TODO */ },
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = EduMatchBlue
            ),
            border = BorderStroke(1.dp, Color(0xFFE5E5E5)),
            contentPadding = PaddingValues(horizontal = 16.dp),
            modifier = Modifier.height(50.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Advanced Filters", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Text(" 1", color = Color.Red, fontWeight = FontWeight.Bold, fontSize = 14.sp) // Số lượng filter
                Spacer(Modifier.width(4.dp))
                Icon(Icons.Default.FilterList, contentDescription = null, modifier = Modifier.size(20.dp))
            }
        }
    }
}