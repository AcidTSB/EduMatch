package com.example.edumatch_androi.ui.components.pricing

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.QueryStats
import androidx.compose.material.icons.filled.Api
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.data.repository.pricing.EnterpriseFeatureRespository
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.navigation
import androidx.navigation.NavController


@OptIn(ExperimentalLayoutApi::class)
@Composable
fun EnterpriseSection(screenWidth: Int, horizontalPadding: Dp, navController: NavController) {
    val isMobile = screenWidth < 600

    // Khối Enterprise là một Card lớn
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 40.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(40.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Enterprise Solution", fontWeight = FontWeight.Bold, fontSize = 28.sp, color = DarkText)
            Text("Looking for a custom solution for your university or institution? We offer tailored enterprise packages with advanced features and dedicated support.",
                fontSize = 16.sp, color = TextGray, textAlign = TextAlign.Center, modifier = Modifier.padding(horizontal = if(isMobile) 0.dp else 60.dp))
            Spacer(Modifier.height(32.dp))

            // 4 Khối tính năng (2x2 Responsive)
            val features = EnterpriseFeatureRespository().getEnterpriseFeatures()
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalArrangement = Arrangement.spacedBy(32.dp),
                maxItemsInEachRow = if (isMobile) 2 else 4
            ) {
                features.forEach { feature ->
                    EnterpriseFeatureItem(feature.icon, feature.title, feature.description, Modifier.widthIn(min = 120.dp).weight(1f))
                }
            }
            Spacer(Modifier.height(40.dp))

            Button(onClick = { navController.navigate("contact_route") }, colors = ButtonDefaults.buttonColors(containerColor = EduMatchBlue)) {
                Text("Contact Sales", fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
fun EnterpriseFeatureItem(icon: ImageVector, title: String, description: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(horizontal = 8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, contentDescription = null, tint = EduMatchBlue, modifier = Modifier.size(36.dp))
        Spacer(Modifier.height(8.dp))
        Text(title, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = DarkText, textAlign = TextAlign.Center)
        Text(description, fontSize = 13.sp, color = TextGray, textAlign = TextAlign.Center)
    }
}

