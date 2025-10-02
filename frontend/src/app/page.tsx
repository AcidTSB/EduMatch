import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue-50 via-white to-brand-cyan-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 AI-Powered Education Platform
            </Badge>
            
            <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">
              Connect Your Future with
              <span className="text-brand-blue-500 block">Smart Scholarship Matching</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Discover personalized scholarship opportunities and research positions using our AI-powered platform. 
              Join thousands of students who found their perfect academic match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg">
                <Link href="/applicant/scholarships">
                  Find Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/provider/scholarships">
                  Post Opportunities
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>1000+ Scholarships</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>95% Match Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span>50+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Why Choose EduMatch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with comprehensive scholarship data to give you the best possible matches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-brand-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-brand-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithm analyzes your profile, skills, and preferences to find scholarships 
                  with the highest compatibility scores.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-brand-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-brand-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-Time Notifications</h3>
                <p className="text-muted-foreground">
                  Get instant alerts when new scholarships match your profile or when application 
                  deadlines are approaching.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-brand-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-brand-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Track your application progress, success rates, and get insights to improve 
                  your scholarship application strategy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <Award className="h-8 w-8 text-brand-blue-500" />
              </div>
              <div className="text-3xl font-bold text-brand-blue-600">1000+</div>
              <div className="text-muted-foreground">Active Scholarships</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-brand-blue-500" />
              </div>
              <div className="text-3xl font-bold text-brand-blue-600">5000+</div>
              <div className="text-muted-foreground">Students Matched</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <School className="h-8 w-8 text-brand-blue-500" />
              </div>
              <div className="text-3xl font-bold text-brand-blue-600">200+</div>
              <div className="text-muted-foreground">Partner Universities</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-brand-blue-500" />
              </div>
              <div className="text-3xl font-bold text-brand-blue-600">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and find your perfect scholarship match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Tell us about your academic background, research interests, and career goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Get AI Matches</h3>
              <p className="text-muted-foreground">
                Our AI analyzes thousands of opportunities to find the best matches for you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply & Track</h3>
              <p className="text-muted-foreground">
                Apply directly through our platform and track your application progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue-600 to-brand-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-brand-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their dream scholarships and research opportunities through EduMatch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-brand-blue-600 hover:bg-brand-blue-50">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue-600">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
