package com.example.edumatch_androi.data.model

data class Message(
    val id: String,
    val senderName: String,
    val lastMessage: String,
    val timestamp: String,
    val unreadCount: Int,
    val isOnline: Boolean
)