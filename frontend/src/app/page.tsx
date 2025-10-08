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
      <section className="relative bg-minimal-hero pt-20 pb-16 min-h-screen flex items-center">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-50/60 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-50/40 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
              🚀 AI-Powered Education Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight text-gray-900">
              Connect Your Future with
              <span className="block text-minimal-primary">Smart Scholarship Matching</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance leading-relaxed">
              Discover personalized scholarship opportunities and research positions using our AI-powered platform. 
              Join thousands of students who found their perfect academic match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                <Link href="/applicant/scholarships">
                  Find Scholarships
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg text-lg">
                <Link href="/provider/scholarships">
                  Post Opportunities
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
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
      <section className="py-20 bg-minimal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-minimal-primary mb-4">
              Why Choose EduMatch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with comprehensive scholarship data to give you the best possible matches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithm analyzes your profile, skills, and preferences to find scholarships 
                  with the highest compatibility scores.
                </p>
              </CardContent>
            </Card>

            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-Time Notifications</h3>
                <p className="text-muted-foreground">
                  Get instant alerts when new scholarships match your profile or when application 
                  deadlines are approaching.
                </p>
              </CardContent>
            </Card>

            <Card className="card-minimal card-hover">
              <CardContent className="p-8 text-center">
                <div className="bg-icon-minimal-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
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
              <div className="text-muted-foreground">Active Scholarships</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">5000+</div>
              <div className="text-muted-foreground">Students Matched</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <School className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">200+</div>
              <div className="text-muted-foreground">Partner Universities</div>
            </div>
            
            <div className="stat-card">
              <div className="flex justify-center mb-4">
                <div className="stat-icon bg-icon-minimal">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="stat-number text-minimal-primary">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-minimal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-minimal-primary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and find your perfect scholarship match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-icon-minimal w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Create Your Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tell us about your academic background, research interests, and career goals.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-icon-minimal-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Get AI Matches</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI analyzes thousands of opportunities to find the best matches for you.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-icon-minimal-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Apply & Track</h3>
              <p className="text-muted-foreground leading-relaxed">
                Apply directly through our platform and track your application progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-minimal-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-minimal-primary mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their dream scholarships and research opportunities through EduMatch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg">
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
