package com.example.edumatch_androi.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.edumatch_androi.data.model.contact.Office
import com.example.edumatch_androi.data.model.contact.getMockOffices
import com.example.edumatch_androi.data.model.contact.ContactFaq
import com.example.edumatch_androi.data.model.contact.getMockFaqs

class ContactViewModel : ViewModel() {

    // States cho Form
    var name by mutableStateOf("")
    var email by mutableStateOf("")
    var category by mutableStateOf("General Inquiry")
    var subject by mutableStateOf("")
    var message by mutableStateOf("")

    // Mock Data cho FAQ và Offices
    val faqs = getMockFaqs()
    val offices = getMockOffices()

    fun sendMessage() {
        // TODO: Gửi dữ liệu form lên API/Firestore
        println("Sending message from: $name ($email) - Subject: $subject")
        // Reset form (tùy chọn)
    }
}