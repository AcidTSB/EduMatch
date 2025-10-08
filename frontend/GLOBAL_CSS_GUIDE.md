# EduMatch Minimal Design System

## Tổng Quan
File `globals.css` đã được cập nhật để tạo ra một **minimal design system** với focus vào **sự tinh tế, chuyên nghiệp** và **dễ đọc**. Loại bỏ các màu sắc quá rực rỡ để tạo nên một giao diện **clean và modern**.

## 🎨 Color System & Backgrounds

### Minimal Backgrounds (Clean & Professional)
- `.bg-minimal-hero` - Light gradient cho hero sections
- `.bg-minimal-section` - Pure white cho content sections  
- `.bg-minimal-light` - Subtle gradient cho alternating sections
- `.bg-minimal-accent` - Light gray gradient cho CTA sections

### Primary Gradients (Dành cho special elements)
- `.bg-gradient-primary` - Gradient chính: blue → purple → cyan (chỉ dùng khi cần)
- `.bg-gradient-secondary` - Gradient nhẹ: light colors
- `.bg-gradient-tertiary` - Gradient trong suốt cho overlays

### Text Colors
- `.text-minimal-primary` - Blue #2563eb cho headings
- `.text-minimal-secondary` - Gray #475569 cho body text
- `.text-gradient-blue` - Subtle blue gradient cho accent text

### Gradient Text
- `.text-gradient-primary` - Text với gradient đầy đủ 3 màu
- `.text-gradient-blue` - Text gradient blue → purple đơn giản hơn

## 🔵 Icon Backgrounds

### Minimal Icon Containers (Recommended)
```css
.bg-icon-minimal           /* Blue #2563eb - Primary icons */
.bg-icon-minimal-secondary /* Gray #475569 - Secondary icons */
.bg-icon-minimal-accent    /* Indigo #6366f1 - Accent icons */
```

### Gradient Icon Containers (Use sparingly)
```css
.bg-icon-blue, .bg-icon-purple, .bg-icon-cyan
.bg-icon-green, .bg-icon-orange, .bg-icon-teal, .bg-icon-pink
```

### Cách Sử Dụng Minimal Icons
```jsx
<div className="bg-icon-minimal w-16 h-16 rounded-2xl flex items-center justify-center">
  <Brain className="h-8 w-8 text-white" />
</div>
```

## 🃏 Card Components

### Minimal Card Variants (Recommended)
- `.card-minimal` - Clean white card với subtle border
- `.card-minimal-elevated` - Elevated white card với more shadow
- `.card-hover` - Subtle hover effects (2px lift instead của 4px)

### Gradient Cards (Use only for special sections)
- `.card-gradient-blue` - Light blue gradient background
- `.card-gradient-cyan` - Light cyan gradient background  
- `.card-gradient-purple` - Light purple gradient background

### Example Minimal Card Usage
```jsx
<Card className="card-minimal card-hover">
  <CardContent className="p-8 text-center">
    <div className="bg-icon-minimal w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Brain className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold mb-4">Card Title</h3>
    <p className="text-muted-foreground">Clean and minimal card description</p>
  </CardContent>
</Card>
```

## ✨ Animations

### Available Animations
- `.animate-float` - Floating effect (6s duration)
- `.animate-scale-hover` - Scale up on hover
- `.animate-pulse-glow` - Glowing pulse effect

### Keyframe Animations
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(147, 51, 234, 0.5); }
}
```

## 📊 Statistics Components

### Stats Classes
- `.stat-card` - Container cho từng stat item
- `.stat-icon` - Icon container với hover animation
- `.stat-number` - Styling cho số liệu thống kê

### Stats Example
```jsx
<div className="stat-card">
  <div className="flex justify-center mb-4">
    <div className="stat-icon bg-icon-blue">
      <Award className="h-8 w-8 text-white" />
    </div>
  </div>
  <div className="stat-number text-gradient-blue">1000+</div>
  <div className="text-muted-foreground">Active Scholarships</div>
</div>
```

## 🎯 Section Layouts

### Section Background Classes
- `.section-overlay` - Tạo overlay effect cho sections
- `.section-gradient-light` - Light gradient background
- `.section-gradient-primary` - Primary gradient background

### Hero Section Template (Minimal Design)
```jsx
<section className="bg-minimal-hero pt-20 pb-16 min-h-screen flex items-center">
  {/* Subtle Background Elements */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-50/60 rounded-full animate-float"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-50/40 rounded-full animate-float"></div>
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
      Your Title
      <span className="block text-minimal-primary">
        Clean Subtitle
      </span>
    </h1>
    {/* Rest of hero content */}
  </div>
</section>
```

### CTA Section Template (Minimal Design)
```jsx
<section className="py-20 bg-minimal-accent">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h2 className="text-3xl font-semibold text-minimal-primary mb-6">
      Call to Action Title
    </h2>
    <p className="text-xl text-gray-600 mb-8">
      Clean description with good readability
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
        Primary Action
      </Button>
      
      <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
        Secondary Action
      </Button>
    </div>
  </div>
</section>
```

## 🚀 Quick Start Templates

### Feature Section Template
```jsx
<section className="py-20 section-overlay">
  <div className="relative max-w-7xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-semibold text-gradient-primary mb-4">
        Section Title
      </h2>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="card-gradient-blue card-hover">
          <CardContent className="p-8 text-center">
            <div className="bg-icon-blue w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-scale-hover">
              <feature.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

### Stats Section Template
```jsx
<section className="py-16 section-gradient-light">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="flex justify-center mb-4">
            <div className={`stat-icon ${stat.iconBg}`}>
              <stat.icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="stat-number text-gradient-blue">{stat.number}</div>
          <div className="text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

## 💡 Best Practices

### 1. Nhất Quán Trong Design
- Luôn sử dụng global classes thay vì inline styles
- Kết hợp các classes để tạo hiệu ứng phong phú
- Duy trì color palette thống nhất

### 2. Performance
- Classes được tối ưu hóa với CSS thuần, không dùng @apply
- Animations sử dụng transform và opacity để tối ưu performance
- Gradients được define sẵn để tránh lặp lại

### 3. Accessibility
- Gradient text vẫn duy trì contrast tốt
- Hover effects rõ ràng cho user interaction
- Animation không quá mạnh để tránh motion sickness

### 4. Responsive Design
- Tất cả components đều responsive
- Breakpoints consistent với Tailwind CSS
- Mobile-first approach

## 🔄 Migration Guide

### Từ Component Cũ Sang Global Classes

**Before:**
```jsx
<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
```

**After:**
```jsx
<div className="bg-gradient-primary">
```

**Before:**
```jsx
<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
```

**After:**
```jsx
<Card className="card-hover">
```

## 📂 File Structure
```
src/
  app/
    globals.css          # Global styles với design system
  components/
    examples/
      GlobalStylesDemo.tsx  # Demo component cho global classes
```

## 🎨 Demo Component
Xem `GlobalStylesDemo.tsx` để thấy examples đầy đủ về cách sử dụng tất cả global classes.

---

**Created by:** EduMatch Frontend Team  
**Last Updated:** October 2025  
**Version:** 1.0