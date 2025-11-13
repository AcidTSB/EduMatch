package com.example.edumatch_androi.ui.components.pricing

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.LightGrayBackground
import com.example.edumatch_androi.data.model.pricing.*
import com.example.edumatch_androi.data.repository.pricing.PricingPlanRespository
import com.example.edumatch_androi.data.repository.pricing.EnterpriseFeatureRespository

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PricingPlansSection(navController: NavController, screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Simple, Transparent Pricing", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.Blue)
        Text("Choose the plan that fits your needs. Start for free and upgrade as you grow. All plans include our core scholarship matching technology.", fontSize = 16.sp, color = TextGray, textAlign = TextAlign.Center)
        Spacer(Modifier.height(16.dp))
        Text("✨ Most students start with our free plan", fontSize = 14.sp, color = Color.Blue)
        Spacer(Modifier.height(40.dp))

        // GRID CÁC THẺ GIÁ
        val plans = PricingPlanRespository().getPricingPlans()

        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(32.dp)) {
                plans.forEach { plan -> PricingCard(plan, navController) }
            }
        } else {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(32.dp),
                verticalArrangement = Arrangement.spacedBy(32.dp),
                modifier = Modifier.fillMaxWidth(),
                maxItemsInEachRow = 3
            ) {
                plans.forEach { plan ->
                    PricingCard(plan, navController, Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun PricingCard(plan: PricingPlan, navController: NavController, modifier: Modifier = Modifier) {
    val isPremium = plan.title == "Premium"
    val isPro = plan.title == "Pro"
    val cardColor = if (isPremium) Color(0xFFFFF0F5) else if (isPro) Color(0xFFE0FFFF) else Color.White

    Card(
        modifier = modifier.widthIn(min = 280.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = cardColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(24.dp).fillMaxWidth()) {
            Text(plan.title, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp, color = DarkText)
            Text(plan.price, fontWeight = FontWeight.Bold, fontSize = 36.sp, color = DarkText)
            Text(plan.subtitle, fontSize = 14.sp, color = TextGray)
            Spacer(Modifier.height(16.dp))
            Divider(color = Color(0xFFE5E5E5))
            Spacer(Modifier.height(16.dp))

            // Inclusions
            Text("What's included:", fontWeight = FontWeight.SemiBold, color = DarkText)
            Spacer(Modifier.height(8.dp))
            plan.inclusions.forEach { item -> IncludedItem(item, isPro) }
            Spacer(Modifier.height(24.dp))

            // Limitations (Only for Free)
            if (plan.limitations.isNotEmpty()) {
                Text("Limitations:", fontWeight = FontWeight.SemiBold, color = DarkText)
                Spacer(Modifier.height(8.dp))
                plan.limitations.forEach { item -> LimitedItem(item) }
                Spacer(Modifier.height(24.dp))
            }

            // Button
            Button(
                onClick = { navController.navigate(plan.buttonRoute) },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isPro) Color(0xFF00CED1) else EduMatchBlue,
                    contentColor = if (isPro) DarkText else Color.White
                )
            ) {
                Text(plan.buttonText, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
fun IncludedItem(text: String, isPro: Boolean) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 4.dp)) {
        Icon(
            Icons.Default.Check,
            contentDescription = null,
            tint = if (isPro) Color(0xFF00CED1) else Color.Green, // Màu xanh ngọc cho Pro
            modifier = Modifier.size(20.dp)
        )
        Spacer(Modifier.width(8.dp))
        Text(text, fontSize = 14.sp, color = DarkText)
    }
}

@Composable
fun LimitedItem(text: String) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 4.dp)) {
        Text("-", color = TextGray, modifier = Modifier.padding(end = 8.dp))
        Text(text, fontSize = 14.sp, color = TextGray)
    }
}



