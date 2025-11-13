package com.example.edumatch_androi.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edumatch_androi.data.model.Scholarship
import com.example.edumatch_androi.data.model.ScholarshipStat
import com.example.edumatch_androi.data.repository.DashboardRepository
import kotlinx.coroutines.launch

// ViewModel này giả định lấy dữ liệu Scholarships từ DashboardRepository
class ScholarshipsViewModel(
    private val repository: DashboardRepository = DashboardRepository()
) : ViewModel() {

    // State cho các thẻ thống kê (13+ Active Scholarships, v.v.)
    var stats by mutableStateOf<List<ScholarshipStat>>(emptyList())
        private set

    // State cho danh sách học bổng
    var scholarships by mutableStateOf<List<Scholarship>>(emptyList())
        private set

    // State cho bộ lọc hoạt động (Mock)
    var activeFilters by mutableStateOf<List<String>>(listOf("$0 - $500", "Full-time"))
        private set

    init {
        fetchScholarshipsData()
    }

    private fun fetchScholarshipsData() {
        viewModelScope.launch {
            repository.getScholarshipStats().collect {
                stats = it
            }
        }
        viewModelScope.launch {
            repository.getAllScholarships().collect {
                scholarships = it
            }
        }
        // TODO: Thêm logic để load dữ liệu thật từ API hoặc Database
    }
}