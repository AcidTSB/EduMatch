package com.example.edumatch_androi.data.model.pricing


data class PricingPlan(
    val title: String,
    val price: String,
    val subtitle: String,
    val inclusions: List<String>,
    val limitations: List<String>,
    val buttonText: String,
    val buttonRoute: String // Điều hướng
)