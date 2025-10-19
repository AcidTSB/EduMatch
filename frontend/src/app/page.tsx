'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  GraduationCap, 
  Brain, 
  Zap, 
  BarChart3, 
  Users, 
  School, 
  Award, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-minimal-hero pt-20 pb-16 min-h-screen flex items-center">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-50/60 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-50/40 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
              {t('home.hero.badge')}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight text-gray-900">
              {t('home.hero.title')}
              <span className="block text-minimal-primary">{t('home.hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance leading-relaxed">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                <Link href="/applicant/scholarships">
                  {t('home.hero.browseScholarships')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg text-lg">
                <Link href="/provider/scholarships">
                  {t('home.hero.postOpportunities')}
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>{t('home.hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>{t('home.hero.trust2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>{t('home.hero.trust3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-minimal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-minimal-primary mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.features.ai.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.ai.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.features.realtime.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.realtime.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.features.analytics.title')}</h3>
                <p className="text-muted-foreground">
                  {t('home.features.analytics.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-minimal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">1000+</div>
              <div className="text-muted-foreground">{t('home.stats.scholarships')}</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">5000+</div>
              <div className="text-muted-foreground">{t('home.stats.students')}</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <School className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">200+</div>
              <div className="text-muted-foreground">{t('home.stats.universities')}</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">95%</div>
              <div className="text-muted-foreground">{t('home.stats.successRate')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-minimal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-minimal-primary mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-icon-minimal w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('home.howItWorks.step1.desc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-icon-minimal-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('home.howItWorks.step2.desc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-icon-minimal-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('home.howItWorks.step3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-minimal-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-minimal-primary mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/signup">
                {t('home.cta.getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg">
              <Link href="/about">
                {t('home.cta.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
