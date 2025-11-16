'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { t } = useLanguage();

  // 🔥 XÓA TẤT CẢ AUTH DATA CŨ KHI LOAD TRANG LOGIN
  React.useEffect(() => {
    // Clear all possible auth storage
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing all auth data on login page load...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_user');
      // Clear cookies (set expired date)
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('✅ All auth data cleared!');
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'username') setUsername(value);
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

    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // 🔥 CLEAR TOKEN CŨ TRƯỚC KHI ĐĂNG NHẬP - Tránh lỗi 401
    console.log('🧹 Clearing old tokens before login...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');

    setIsLoading(true);
    const toastId = toast.loading('🔐 Đang đăng nhập...');
    
    try {
      console.log('🚀 Calling authService.login with:', { username, password: '***' });
      
      // Gọi trực tiếp authService - KHÔNG qua useAuth
      const response = await authService.login({
        email: username,
        password: password,
      });

      console.log('✅ Login success! Response:', response);
      
      toast.success('✅ Đăng nhập thành công!', {
        id: toastId,
        description: `Chào mừng ${response.user.firstName || response.user.username}!`,
        duration: 2000,
      });

      // Lưu thông tin vào localStorage
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }

      // Redirect dựa trên role - NGAY LẬP TỨC
      const role = response.user.roles[0]?.toLowerCase();
      console.log('🔄 Redirecting to dashboard for role:', role);
      
      setTimeout(() => {
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'employer') {
          router.push('/employer/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sai username hoặc password';
      toast.error('❌ Đăng nhập thất bại', {
        id: toastId,
        description: errorMessage,
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
                  placeholder="Nhập username (ví dụ: admin, testuser)"
                  value={username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="pl-10"
                  error={errors.username}
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-danger-500 ml-1">{errors.username}</p>
              )}
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

        </CardContent>
      </Card>
    </div>
  );
}