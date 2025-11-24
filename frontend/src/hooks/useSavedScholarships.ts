import { useState, useEffect, useCallback } from 'react';
import { scholarshipServiceApi } from '@/services/scholarship.service';
import { toast } from 'react-hot-toast';

export function useSavedScholarships() {
  // Dùng Set để tra cứu ID nhanh (O(1))
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách bookmark từ Backend khi mới vào app
  const fetchSavedStatus = useCallback(async () => {
    try {
      const bookmarks = await scholarshipServiceApi.getMyBookmarks();
      // Backend trả về mảng [{ id: 1, opportunity: { id: 101... } }]
      // Chúng ta chỉ cần ID của opportunity
      if (Array.isArray(bookmarks)) {
        const ids = new Set(bookmarks.map((b: any) => b.opportunity.id.toString()));
        setSavedIds(ids);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  }, []);

  // Gọi fetch khi mount hook
  useEffect(() => {
    fetchSavedStatus();
  }, [fetchSavedStatus]);

  // 2. Hàm Toggle (Save/Unsave)
  const toggleSaved = async (scholarshipId: string) => {
    setLoading(true);
    
    // Optimistic Update: Cập nhật giao diện ngay lập tức cho mượt
    const isCurrentlySaved = savedIds.has(scholarshipId);
    
    setSavedIds(prev => {
      const newSet = new Set(prev);
      if (isCurrentlySaved) {
        newSet.delete(scholarshipId); // Nếu đang có thì xóa
      } else {
        newSet.add(scholarshipId);    // Nếu chưa có thì thêm
      }
      return newSet;
    });

    try {
      // Gọi API thật
      await scholarshipServiceApi.toggleBookmark(Number(scholarshipId));
    } catch (error) {
      // Nếu lỗi thì hoàn tác (Revert)
      console.error('Toggle bookmark failed:', error);
      toast.error('Failed to update bookmark');
      setSavedIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) newSet.add(scholarshipId);
        else newSet.delete(scholarshipId);
        return newSet;
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Hàm kiểm tra
  const isScholarshipSaved = (id: string) => savedIds.has(id);

  return {
    isScholarshipSaved,
    toggleSaved,
    loading,
    refreshSaved: fetchSavedStatus 
  };
}