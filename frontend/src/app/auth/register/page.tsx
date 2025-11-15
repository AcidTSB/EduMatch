'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Đã xóa 'sex' và 'role' khỏi state - backend không cần
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('register.errors.nameLength');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('register.errors.nameLength');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('register.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('register.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('register.errors.passwordLength');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('register.errors.passwordComplexity');
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('register.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch');
    }

    // Đã xóa validate cho 'sex' và 'role' - backend không cần

    if (!agreeToTerms) {
      newErrors.terms = t('register.errors.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Thông tin không hợp lệ', {
        description: 'Vui lòng kiểm tra lại các trường thông tin',
      });
      return;
    }

    // 🔥 CLEAR TOKEN CŨ TRƯỚC KHI ĐĂNG KÝ - Tránh lỗi 401
    console.log('🧹 Clearing old tokens before registration...');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');

    setIsLoading(true);
    const toastId = toast.loading('📝 Đang tạo tài khoản...');

    try {
      console.log('🚀 Calling authService.register with:', {
        ...formData,
        password: '***',
      });

      // Gọi trực tiếp authService - KHÔNG qua useAuth
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        // sex: removed - backend không cần
      });

      console.log('✅ Registration success! Response:', response);

      toast.success('✅ Đăng ký thành công!', {
        id: toastId,
        description: `Chào mừng ${formData.firstName} ${formData.lastName} đến với EduMatch!`,
        duration: 2000,
      });

      // Lưu thông tin vào localStorage
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }

      // Redirect đến trang user dashboard - NGAY LẬP TỨC
      console.log('🔄 Redirecting to user dashboard...');
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message || t('register.errors.submitFailed');
      toast.error('❌ Đăng ký thất bại', {
        id: toastId,
        description: errorMessage,
      });
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts editing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
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
          <CardTitle className="text-2xl text-center">
            {t('register.title')}
          </CardTitle>
          <p className="text-muted-foreground text-center">
            {t('register.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* --- THAY ĐỔI: Gộp First Name và Last Name --- */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('register.firstName')}
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className="pl-10"
                    error={errors.firstName}
                  />
                </div>
                {/* THÊM: Hiển thị lỗi */}
                {errors.firstName && (
                  <p className="text-xs text-danger-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('register.lastName')}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="pl-10"
                    error={errors.lastName}
                  />
                </div>
                {/* THÊM: Hiển thị lỗi */}
                {errors.lastName && (
                  <p className="text-xs text-danger-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            {/* --- KẾT THÚC THAY ĐỔI --- */}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="email"
                  placeholder={t('register.email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  error={errors.email}
                />
              </div>
              {/* THÊM: Hiển thị lỗi */}
              {errors.email && (
                <p className="text-xs text-danger-500">{errors.email}</p>
              )}
            </div>

            {/* --- THAY ĐỔI: Đã xóa trường chọn Sex và Role - backend không yêu cầu --- */}

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('register.password')}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
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
              {/* THÊM: Hiển thị lỗi */}
              {errors.password && (
                <p className="text-xs text-danger-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('register.confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className="pl-10 pr-10"
                  error={errors.confirmPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {/* THÊM: Hiển thị lỗi */}
              {errors.confirmPassword && (
                <p className="text-xs text-danger-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked === true)
                  }
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer leading-5"
                >
                  {t('register.agreeTerms')}{' '}
                  <Link
                    href="/terms"
                    className="text-brand-blue-500 hover:underline"
                    target="_blank"
                  >
                    {t('register.terms')}
                  </Link>{' '}
                  {t('register.and')}{' '}
                  <Link
                    href="/privacy"
                    className="text-brand-blue-500 hover:underline"
                    target="_blank"
                  >
                    {t('register.privacy')}
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-danger-500">{errors.terms}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('register.creating') : t('register.button')}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('register.haveAccount')}{' '}
              <Link
                href="/auth/login"
                className="text-brand-blue-500 hover:underline font-medium"
              >
                {t('register.signIn')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}