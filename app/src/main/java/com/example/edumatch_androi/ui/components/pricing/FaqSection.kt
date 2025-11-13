package com.example.edumatch_androi.ui.components.pricing

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.data.model.pricing.Faq
import androidx.compose.foundation.clickable
import androidx.compose.ui.graphics.Color
import com.example.edumatch_androi.data.repository.pricing.FaqRespository
import androidx.compose.foundation.BorderStroke
import androidx.navigation.NavController

@Composable
fun FaqSection(horizontalPadding: Dp, navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Frequently Asked Questions", fontWeight = FontWeight.Bold, fontSize = 28.sp, color = DarkText)
        Text("Got questions? We've got answers.", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(40.dp))

        // Danh sách FAQ
        Column(modifier = Modifier.fillMaxWidth().widthIn(max = 800.dp)) {
            FaqRespository().getFaqList().forEach { faq ->
                FaqItem(faq)
            }
        }

        Spacer(Modifier.height(40.dp))
        Text("Still have questions? We're here to help.", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(16.dp))
        OutlinedButton(onClick = { navController.navigate("contact_route") }, border = BorderStroke(1.dp, TextGray)) {
            Text("Contact Support", color = DarkText, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun FaqItem(faq: Faq) {
    var expanded by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(faq.question, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = DarkText, modifier = Modifier.weight(1f))
            Icon(Icons.Default.Add, contentDescription = if (expanded) "Collapse" else "Expand", tint = EduMatchBlue)
        }

        if (expanded) {
            Text(faq.answer, fontSize = 14.sp, color = TextGray, modifier = Modifier.padding(bottom = 12.dp))
        }
        Divider(color = Color(0xFFE5E5E5))
    }
}