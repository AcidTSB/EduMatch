package com.example.edumatch_androi.ui.components.about

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.ui.draw.clip


@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OurTeamSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp)
    ) {
        Text("Our Team", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.Blue)
        Text("The passionate individuals working to make education more accessible.", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(40.dp))

        // Bố cục Lưới 4 cột Responsive
        if (isMobile) {
            Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                TeamMemberCard(TeamMember.DrWilson)
                TeamMemberCard(TeamMember.MichaelChen)
                TeamMemberCard(TeamMember.EmilyRodriguez)
                TeamMemberCard(TeamMember.DavidKumar)
            }
        } else {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(24.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
                // Chia 4 cột
                TeamMemberCard(TeamMember.DrWilson, Modifier.weight(1f))
                TeamMemberCard(TeamMember.MichaelChen, Modifier.weight(1f))
                TeamMemberCard(TeamMember.EmilyRodriguez, Modifier.weight(1f))
                TeamMemberCard(TeamMember.DavidKumar, Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun TeamMemberCard(member: TeamMember, modifier: Modifier = Modifier) {
    Card(modifier = modifier) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Placeholder cho ảnh đại diện
            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(56.dp).clip(CircleShape), tint = Color.Gray)
            Spacer(Modifier.height(12.dp))

            Text(member.name, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.Blue)
            Text(member.role, fontSize = 14.sp, color = Color.Green.copy(alpha = 0.7f)) // Màu xanh lá nhẹ
            Text(member.credentials, fontSize = 12.sp, color = TextGray)
        }
    }
}

data class TeamMember(val name: String, val role: String, val credentials: String) {
    companion object {
        val DrWilson = TeamMember("Dr. Sarah Wilson", "Founder & CEO", "PhD in Education Technology, Stanford")
        val MichaelChen = TeamMember("Michael Chen", "CTO", "MS Computer Science, MIT")
        val EmilyRodriguez = TeamMember("Emily Rodriguez", "Head of AI", "PhD Machine Learning, UC Berkeley")
        val DavidKumar = TeamMember("David Kumar", "Head of Partnerships", "MBA Harvard Business School")
    }
}