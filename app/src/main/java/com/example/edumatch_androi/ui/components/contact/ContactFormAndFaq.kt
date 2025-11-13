package com.example.edumatch_androi.ui.components.contact

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edumatch_androi.ui.theme.DarkText
import com.example.edumatch_androi.ui.theme.TextGray
import com.example.edumatch_androi.ui.theme.EduMatchBlue
import com.example.edumatch_androi.ui.viewmodel.ContactViewModel
import com.example.edumatch_androi.data.model.contact.ContactFaq
import androidx.compose.material.icons.filled.ArrowDropDown

@Composable
fun ContactFormAndFaq(screenWidth: Int, horizontalPadding: Dp, viewModel: ContactViewModel) {
    val isMobile = screenWidth < 600

    Column(modifier = Modifier.padding(horizontal = horizontalPadding, vertical = 24.dp)) {
        if (isMobile) {
            // MOBILE: Xếp chồng (Form trên, FAQ dưới)
            ContactForm(viewModel)
            Spacer(Modifier.height(32.dp))
            ContactFaqSection(viewModel.faqs)
        } else {
            // DESKTOP: Chia 2 cột
            Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                Column(modifier = Modifier.weight(1f)) { ContactForm(viewModel) }
                Column(modifier = Modifier.weight(1f)) { ContactFaqSection(viewModel.faqs) }
            }
        }
    }
}

// Khối Form
@Composable
fun ContactForm(viewModel: ContactViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text("Send us a Message", fontWeight = FontWeight.Bold, fontSize = 24.sp, color = DarkText)
            Spacer(Modifier.height(24.dp))

            // 1. Name & Email
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = viewModel.name, onValueChange = { viewModel.name = it }, label = { Text("Name *") },
                    modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp)
                )
                OutlinedTextField(
                    value = viewModel.email, onValueChange = { viewModel.email = it }, label = { Text("Email *") },
                    modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp)
                )
            }
            Spacer(Modifier.height(16.dp))

            // 2. Category Dropdown
            // Dùng Box + DropdownMenu để mô phỏng Dropdown
            Box(modifier = Modifier.fillMaxWidth()) {
                var expanded by remember { mutableStateOf(false) }
                val categories = listOf("General Inquiry", "Scholarship Support", "Partnership Inquiry")

                OutlinedButton(
                    onClick = { expanded = true },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(16.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(viewModel.category, color = DarkText, fontSize = 16.sp)
                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = TextGray)
                    }
                }
                DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    categories.forEach { category ->
                        DropdownMenuItem(text = { Text(category) }, onClick = { viewModel.category = category; expanded = false })
                    }
                }
            }
            Spacer(Modifier.height(16.dp))

            // 3. Subject
            OutlinedTextField(
                value = viewModel.subject, onValueChange = { viewModel.subject = it }, label = { Text("Subject *") },
                modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(8.dp)
            )
            Spacer(Modifier.height(16.dp))

            // 4. Message
            OutlinedTextField(
                value = viewModel.message, onValueChange = { viewModel.message = it }, label = { Text("Message *") },
                modifier = Modifier.fillMaxWidth().height(150.dp), shape = RoundedCornerShape(8.dp)
            )
            Spacer(Modifier.height(24.dp))

            // 5. Send Button
            Button(
                onClick = { viewModel.sendMessage() },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Send Message", fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

// Khối FAQ
@Composable
fun ContactFaqSection(faqs: List<ContactFaq>) {
    Column {
        Text("Frequently Asked Questions", fontWeight = FontWeight.SemiBold, fontSize = 24.sp, color = DarkText)
        Spacer(Modifier.height(16.dp))

        faqs.forEach { faq ->
            ContactFaqItem(faq)
            Spacer(Modifier.height(16.dp))
        }

        // Khối Need Immediate Help
        Card(
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0F8FF)) // Light Blue Background
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Need Immediate Help?", fontWeight = FontWeight.SemiBold, fontSize = 18.sp, color = DarkText)
                Text("Check out our comprehensive help center with articles, tutorials, and guides.", fontSize = 14.sp, color = TextGray)
                Spacer(Modifier.height(12.dp))
                TextButton(onClick = { /* Navigate to Help Center */ }) {
                    Text("Visit Help Center", color = EduMatchBlue, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Composable
fun ContactFaqItem(faq: ContactFaq) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(faq.question, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = DarkText)
            Spacer(Modifier.height(8.dp))
            Text(faq.answer, fontSize = 14.sp, color = TextGray)
        }
    }
}