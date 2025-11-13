package com.example.edumatch_androi.data.repository.pricing

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import androidx.compose.material3.ButtonDefaults

@Composable
fun PricingCtaFooter(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Join over 50,000 students who have found their ideal funding opportunities.", fontSize = 16.sp, color = DarkText)
        Spacer(Modifier.height(24.dp))
        Button(onClick = { navController.navigate("register_route") }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00CED1))) {
            Text("Start Free Today", fontWeight = FontWeight.SemiBold)
        }
    }
}