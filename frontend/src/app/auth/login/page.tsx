'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // 1. Import router
import { useQueryClient } from '@tanstack/react-query'; // 2. Import query client

// 3. Import ĐÚNG hook useAuth và file api
import { useAuth, User } from '@/hooks/useAuth'; // ✅ SỬA LỖI 1: Import 'User' type
import api from '@/lib/api';
import { UserRole } from '@/types'; // ✅ SỬA LỖI 1: Import 'UserRole'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 4. Lấy các hàm và state
  // ✅ SỬA LỖI 1: Xóa 'error: authError' vì useAuth không cung cấp nó.
  const { login: setAuthState } = useAuth(); 
  const { t } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  // validateForm() và handleInputChange() giữ nguyên
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = t('login.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.emailInvalid');
    }

    if (!password.trim()) {
      newErrors.password = t('login.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('login.passwordLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 5. SỬA LẠI HOÀN TOÀN handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('login.invalidCredentials'), {
        description: 'Vui lòng kiểm tra lại thông tin đăng nhập'
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Đang đăng nhập...');
    
    try {
      // 6. TỰ GỌI API login
      const response = await api.auth.login({ email, password });
      
      // ✅ SỬA LỖI 2 & 3: Thêm kiểm tra 'response.data'
      // Lỗi này xảy ra vì 'data' có thể là optional (data?: T)
      if (!response.data) {
        throw new Error('Không nhận được dữ liệu từ server');
      }

      // 'user' từ API trả về thực chất là 'UserProfile'
      const { token, user: profile } = response.data; // Đổi tên 'user' thành 'profile'

      // 7. ✅ SỬA LỖI 1: Xây dựng object 'User' đầy đủ
      // Object này khớp với định nghĩa 'User' trong useAuth.ts
      const userToAuth: User = {
        id: profile.id,
        email: profile.email || '',
        role: profile.role || UserRole.USER,
        status: 'ACTIVE' as any,
        subscriptionType: 'FREE' as any,
        emailVerified: profile.verified || false,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        profile: profile, // Gắn profile vào user
      };

      // 8. GỌI HÀM setAuthState với object 'User' đầy đủ
      setAuthState(token, userToAuth); // Lỗi 1 đã được sửa

      // 9. ✅ SỬA LỖI 2: Cập nhật cache với 'profile' (là UserProfile)
      queryClient.setQueryData(['currentUser'], { data: profile }); // Lỗi 2 đã được sửa

      toast.success('Đăng nhập thành công!', {
        id: toastId,
        description: `Chào mừng bạn trở lại, ${email}`
      });

      // 10. TỰ CHUYỂN HƯỚNG (dùng userToAuth)
      if (userToAuth.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (userToAuth.role === 'EMPLOYER') {
        router.push('/employer/dashboard');
      } else {
        router.push('/user/dashboard'); 
      }

    } catch (error: any) {
      console.error('Login failed:', error);
      // Lấy message lỗi từ API response nếu có
      // ✅ SỬA LỖI 1: Xóa 'authError' và lấy lỗi trực tiếp
      const errorMessage = error.message || t('login.invalidCredentials');
      toast.error('Đăng nhập thất bại', {
        id: toastId,
        description: errorMessage
      });
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 via-white to-brand-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-brand-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{t('login.welcomeBack')}</CardTitle>
          <p className="text-muted-foreground text-center">
            {t('login.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Username (e.g., admin, testuser)"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  error={errors.email}
                  autoComplete="username"
                />
              </div>
              <p className="text-xs text-muted-foreground ml-1">
                Default accounts: admin/admin123, testuser/test123
              </p>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  error={errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {t('login.rememberMe')}
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-brand-blue-500 hover:underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('login.signingIn') : t('login.signIn')}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('login.noAccount')}{' '}
              <Link
                href="/auth/register"
                className="text-brand-blue-500 hover:underline font-medium"
              >
                {t('login.signUp')}
              </Link>
            </div>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">
              {t('login.demoAccounts')}
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{t('login.adminAccount')}</p>
                <p className="text-blue-700">Email: admin@edumatch.com</p>
                <p className="text-blue-700">Password: any password</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-medium text-green-900">{t('login.studentAccount')}</p>
                <p className="text-green-700">Email: john.doe@student.edu</p>
                <p className="text-green-700">Password: any password</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="font-medium text-purple-900">{t('login.providerAccount')}</p>
                <p className="text-purple-700">Email: mit@scholarships.edu</p>
                <p className="text-purple-700">Password: any password</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}