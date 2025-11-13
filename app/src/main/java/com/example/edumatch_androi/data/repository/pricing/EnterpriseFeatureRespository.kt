package com.example.edumatch_androi.data.repository.pricing

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AllInbox
import androidx.compose.material.icons.filled.Api
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.CheckCircleOutline
import androidx.compose.material.icons.filled.HourglassEmpty
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.QueryStats
import com.example.edumatch_androi.data.model.Application
import com.example.edumatch_androi.data.model.ApplicationStat
import com.example.edumatch_androi.data.model.Fellowship
import com.example.edumatch_androi.data.model.Notification
import com.example.edumatch_androi.ui.theme.BlueAccent
import com.example.edumatch_androi.ui.theme.GreenAccent
import com.example.edumatch_androi.ui.theme.YellowAccent
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
//import com.example.edumatch_androi.data.model.ScholarshipStat
import com.example.edumatch_androi.data.model.*
import com.example.edumatch_androi.data.model.pricing.EnterpriseFeature

class EnterpriseFeatureRespository {
    fun getEnterpriseFeatures(): List<EnterpriseFeature> = listOf(
        EnterpriseFeature(Icons.Default.Lock, "Enterprise Security", "Advanced security features and compliance for institutions"),
        EnterpriseFeature(Icons.Default.People, "Team Management", "Manage multiple users and departments with role-based access"),
        EnterpriseFeature(Icons.Default.QueryStats, "Analytics Dashboard", "Comprehensive reporting and insights for your scholarship programs"),
        EnterpriseFeature(Icons.Default.Api, "API Access", "Integrate EduMatch with your existing systems and workflows")
    )
}