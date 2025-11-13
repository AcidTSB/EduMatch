@file:OptIn(ExperimentalMaterial3Api::class)
package com.example.edumatch_androi.ui.components.contact

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Apartment
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
import com.example.edumatch_androi.data.model.contact.Office
import com.example.edumatch_androi.data.model.contact.getMockOffices
import androidx.compose.material3.CardDefaults
//import androidx.compose.material3.ExperimentalLayoutApi
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.foundation.layout.FlowRow

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OurOfficesSection(screenWidth: Int, horizontalPadding: Dp) {
    val isMobile = screenWidth < 600
    val offices = getMockOffices()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = horizontalPadding, vertical = 64.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Our Offices", fontWeight = FontWeight.Bold, fontSize = 28.sp, color = DarkText)
        Text("Visit us at one of our locations", fontSize = 16.sp, color = TextGray)
        Spacer(Modifier.height(32.dp))

        // 3 Thẻ văn phòng (Responsive)
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(32.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            maxItemsInEachRow = if (isMobile) 1 else 3
        ) {
            offices.forEach { office ->
                OfficeCard(office, Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun OfficeCard(office: Office, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Apartment, contentDescription = null, tint = Color.Black, modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(8.dp))
                Text(office.city, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = DarkText)
            }
            Text(office.title, fontSize = 14.sp, color = TextGray)
            Spacer(Modifier.height(16.dp))

            // Địa chỉ
            Row(verticalAlignment = Alignment.Top, modifier = Modifier.padding(bottom = 8.dp)) {
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = TextGray, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text(office.address, fontSize = 14.sp, color = DarkText)
            }

            // Điện thoại
            Row(verticalAlignment = Alignment.Top) {
                Icon(Icons.Default.Phone, contentDescription = null, tint = TextGray, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text(office.phone, fontSize = 14.sp, color = DarkText)
            }
        }
    }
}