package com.example.edumatch_androi.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edumatch_androi.data.model.Application
import com.example.edumatch_androi.data.model.ApplicationStat
import com.example.edumatch_androi.data.model.CurrentUser
import com.example.edumatch_androi.data.model.Fellowship
import com.example.edumatch_androi.data.model.Notification
import com.example.edumatch_androi.data.repository.DashboardRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch


class DashboardViewModel(
    // Trong môi trường thực tế, dùng Hilt để inject Repository
    private val repository: DashboardRepository = DashboardRepository()
) : ViewModel() {
    //States được quan sát bởi Ui
    var stats by mutableStateOf<List<ApplicationStat>>(emptyList())
        private set
    var notifications by mutableStateOf<List<Notification>>(emptyList())
        private set
    var recommended by mutableStateOf<List<Fellowship>>(emptyList())
        private set
    var currentUser by mutableStateOf(
        CurrentUser(
            uid = "",
            displayName = "Guest",
            userEmail = "",
            role = ""
        )
    ) // Giá trị khởi tạo
        private set

    // THÊM STATE MỚI CHO RECENT APPLICATIONS
    var recentApplications by mutableStateOf<List<Application>>(emptyList())
        private set

    init {
        fetchDashboardData()
        fetchUserInfo()
    }

    private fun fetchDashboardData() {
        viewModelScope.launch {
            repository.getApplicationStats().collect {
                stats = it
            }
        }
        viewModelScope.launch {
            repository.getRecentNotifications().collect {
                notifications = it
            }
        }
        viewModelScope.launch {
            repository.getRecommendedFellowships().collect {
                recommended = it
            }
        }
        // THÊM MỘT LAUNCH NỮA ĐỂ LẤY RECENT APPLICATIONS
        viewModelScope.launch {
            repository.getRecentApplications().collect {
                recentApplications = it
            }
        }
    }

    // HÀM fetchUserName NẰM BÊN TRONG CLASS, NGANG HÀNG VỚI fetchDashboardData
    // ✅ CẬP NHẬT HÀM ĐỂ XÂY DỰNG VÀ GÁN ĐỐI TƯỢNG CurrentUser
    private fun fetchUserInfo() {
        val auth = FirebaseAuth.getInstance()
        val firebaseUser = auth.currentUser

        if (firebaseUser != null) {
            val userEmail = firebaseUser.email ?: "email@error.com"
            // Lấy tên để hiển thị (từ displayName hoặc email)
            val fetchedDisplayName = firebaseUser.displayName?.takeIf { it.isNotBlank() } ?: userEmail.substringBefore('@')

            // TODO: Lấy role thực tế từ Firestore
            val fetchedRole = "Student" // MOCK/GIẢ LẬP ROLE

            // GÁN GIÁ TRỊ USER MỚI
            currentUser = CurrentUser(
                uid = firebaseUser.uid?: "default_uid",
                displayName = fetchedDisplayName,
                userEmail = userEmail,
                role = fetchedRole
            )
        } else {
            // Gán giá trị khi người dùng chưa đăng nhập
            currentUser = CurrentUser(uid = "", displayName = "Khách", userEmail = "", role = "Unknown")
        }
    }
}