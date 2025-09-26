export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              EduMatch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nền tảng thông minh kết nối sinh viên với cơ hội nghiên cứu và học bổng sau đại học
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Tìm học bổng
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Đăng học bổng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
              <p className="text-gray-600">
                Thuật toán AI thông minh giúp tìm học bổng phù hợp nhất với profile của bạn
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thời gian thực</h3>
              <p className="text-gray-600">
                Nhận thông báo ngay khi có học bổng mới phù hợp hoặc cập nhật đơn ứng tuyển
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phân tích chi tiết</h3>
              <p className="text-gray-600">
                Dashboard chi tiết giúp theo dõi tiến trình và tối ưu hóa cơ hội thành công
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Học bổng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Sinh viên</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Trường đại học</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Tỷ lệ thành công</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia EduMatch ngay hôm nay và khám phá hàng ngàn cơ hội học bổng
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
            Đăng ký ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EduMatch</h3>
              <p className="text-gray-400">
                Nền tảng thông minh kết nối sinh viên với cơ hội nghiên cứu và học bổng
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tìm học bổng</li>
                <li>Đăng học bổng</li>
                <li>AI Matching</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Trung tâm trợ giúp</li>
                <li>Liên hệ</li>
                <li>FAQ</li>
                <li>API Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Về chúng tôi</li>
                <li>Nghề nghiệp</li>
                <li>Quyền riêng tư</li>
                <li>Điều khoản</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
