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

    // ✅ THAY ĐỔI 1: Đảm bảo giá trị khởi tạo RỖNG để isNotBlank() là FALSE
    var currentUser by mutableStateOf(
        CurrentUser(
            uid = "",
            displayName = "", // <<< ĐẶT MẶC ĐỊNH LÀ CHUỖI RỖNG
            userEmail = "",
            role = ""
        )
    )
        private set

    //States được quan sát bởi Ui (Giữ nguyên)
    var stats by mutableStateOf<List<ApplicationStat>>(emptyList())
        private set
    var notifications by mutableStateOf<List<Notification>>(emptyList())
        private set
    var recommended by mutableStateOf<List<Fellowship>>(emptyList())
        private set
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
        viewModelScope.launch {
            repository.getRecentApplications().collect {
                recentApplications = it
            }
        }
    }

    // ✅ THAY ĐỔI 2: Cập nhật logic khi chưa đăng nhập
    private fun fetchUserInfo() {
        val auth = FirebaseAuth.getInstance()
        val firebaseUser = auth.currentUser

        if (firebaseUser != null && firebaseUser.uid.isNotBlank()) {
            val userEmail = firebaseUser.email ?: "email@error.com"
            val fetchedDisplayName = firebaseUser.displayName?.takeIf { it.isNotBlank() }
                ?: userEmail.substringBefore('@')

            // TODO: Lấy role thực tế từ Firestore
            val fetchedRole = "Student"

            // GÁN GIÁ TRỊ USER MỚI (Đã đăng nhập)
            currentUser = CurrentUser(
                uid = firebaseUser.uid, //?: "default_uid",
                displayName = fetchedDisplayName,
                userEmail = userEmail,
                role = fetchedRole
            )
        } else {
            // GÁN GIÁ TRỊ RỖNG khi người dùng chưa đăng nhập
            currentUser = CurrentUser(uid = "", displayName = "", userEmail = "", role = "Unknown")
        }
    }

    // đăng xuất
    fun signOut(onSignOutComplete: () -> Unit) {
        FirebaseAuth.getInstance().signOut()
        // Đặt lại trạng thái người dùng về rỗng ngay lập tức
        currentUser = CurrentUser(uid = "", displayName = "", userEmail = "", role = "Unknown")

        // Yêu cầu Navigation chuyển hướng đến màn hình Login sau khi đăng xuất
        onSignOutComplete()
    }
}

