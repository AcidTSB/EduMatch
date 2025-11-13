package com.example.edumatch_androi.ui.components.scholarship

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.TextGray

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilterRowsSection(screenWidth: Int) {
    val isMobile = screenWidth < 600

    // Trên mobile, các Dropdown sẽ xếp chồng dọc
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {

        // Hàng 1: Search theo trường (giữ nguyên)
        OutlinedTextField(
            value = "",
            onValueChange = { /* TODO */ },
            label = { Text("Search scholarships, universities, fields...", color = TextGray) },
            leadingIcon = { Icon(Icons.Default.Search, null, tint = TextGray) },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(8.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                unfocusedBorderColor = Color(0xFFE5E5E5)
            )
        )

        // Hàng 2: Dropdowns (Dùng FlowRow/Row để Responsive)
        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                DropdownFilter("All Levels")
                DropdownFilter("All Fields")
                DropdownFilter("Sort by Deadline")
            }
        } else {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                DropdownFilter("All Levels", Modifier.weight(1f))
                DropdownFilter("All Fields", Modifier.weight(1f))
                DropdownFilter("Sort by Deadline", Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun DropdownFilter(label: String, modifier: Modifier = Modifier) {
    OutlinedButton(
        onClick = { /* Mở Dropdown */ },
        modifier = modifier.height(50.dp),
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.outlinedButtonColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color(0xFFE5E5E5))
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(label, color = TextGray, fontSize = 14.sp)
            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = TextGray)
        }
    }
}