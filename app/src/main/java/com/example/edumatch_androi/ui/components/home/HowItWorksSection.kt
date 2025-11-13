package com.example.edumatch_androi.ui.components.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.theme.TextGray

@Composable
fun HowItWorksSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("How It Works", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = DarkText)
        Text(
            "Get started in three simple steps and find your perfect scholarship match.",
            fontSize = 16.sp,
            color = TextGray,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(40.dp))

        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(40.dp)) {
                StepItem(1, "Create Your Profile", "Tell us about your academic background, research interests, and career goals.")
                StepItem(2, "Get AI Matches", "Our AI analyzes thousands of opportunities to find the best matches for you.")
                StepItem(3, "Apply & Track", "Apply directly through our platform and track your application progress.")
            }
        } else {
            Row(horizontalArrangement = Arrangement.SpaceAround) {
                StepItem(1, "Create Your Profile", "Tell us about your academic background, research interests, and career goals.", Modifier.weight(1f).padding(horizontal = 16.dp))
                StepItem(2, "Get AI Matches", "Our AI analyzes thousands of opportunities to find the best matches for you.", Modifier.weight(1f).padding(horizontal = 16.dp))
                StepItem(3, "Apply & Track", "Apply directly through our platform and track your application progress.", Modifier.weight(1f).padding(horizontal = 16.dp))
            }
        }
    }
}

@Composable
fun StepItem(number: Int, title: String, description: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(EduMatchBlue, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(number.toString(), color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.SemiBold)
        }
        Spacer(Modifier.height(16.dp))
        Text(title, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DarkText, textAlign = TextAlign.Center)
        Spacer(Modifier.height(8.dp))
        Text(description, fontSize = 14.sp, color = TextGray, textAlign = TextAlign.Center)
    }
}