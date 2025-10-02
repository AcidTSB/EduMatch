'use client';

import React from 'react';
import { 
  Check, 
  Star, 
  Zap,
  Shield,
  Users,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for students just starting their search',
      features: [
        'Access to 500+ scholarships',
        'Basic AI matching',
        'Application tracking',
        'Email notifications',
        'Mobile app access',
        'Community support'
      ],
      limitations: [
        '5 applications per month',
        'Standard matching accuracy',
        'Basic profile features'
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'For serious students who want the best matches',
      features: [
        'Access to 2,000+ scholarships',
        'Advanced AI matching',
        'Unlimited applications',
        'Priority notifications',
        'Advanced analytics',
        'Personal matching score',
        'Application templates',
        'Deadline reminders',
        'Priority support'
      ],
      limitations: [],
      cta: 'Start Premium Trial',
      popular: true,
      color: 'border-brand-blue-500'
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'For students who want comprehensive support',
      features: [
        'Everything in Premium',
        'Personal scholarship consultant',
        'Essay review service',
        'Interview preparation',
        'Custom recommendation letters',
        'White-glove application support',
        'Success guarantee program',
        'Exclusive scholarship opportunities',
        '1-on-1 mentoring sessions',
        '24/7 priority support'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security features and compliance for institutions'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage multiple users and departments with role-based access'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive reporting and insights for your scholarship programs'
    },
    {
      icon: Zap,
      title: 'API Access',
      description: 'Integrate EduMatch with your existing systems and workflows'
    }
  ];

  const faqs = [
    {
      question: 'How does the AI matching work?',
      answer: 'Our AI analyzes your academic background, interests, achievements, and goals to find scholarships that best match your profile. The more information you provide, the more accurate the matches become.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.'
    },
    {
      question: 'Is there a free trial for premium plans?',
      answer: 'Yes, we offer a 14-day free trial for our Premium plan. No credit card required to start.'
    },
    {
      question: 'What happens if I don\'t get accepted to any scholarships?',
      answer: 'Our Pro plan includes a success guarantee. If you follow our recommendations and don\'t receive any scholarship offers within 6 months, we\'ll provide additional support or a partial refund.'
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes, we offer additional discounts for students from underrepresented backgrounds. Contact our support team to learn more about available programs.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start for free and upgrade as you grow.
            All plans include our core scholarship matching technology.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              💡 Most students start with our free plan
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-brand-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-blue-500 text-white">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-center text-sm text-gray-600">
                              <span className="w-4 h-4 mr-2 text-center">•</span>
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      asChild 
                      className={`w-full mt-6 ${plan.popular ? 'bg-brand-blue-600 hover:bg-brand-blue-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Link href={plan.name === 'Free' ? '/auth/register' : '/auth/register'}>
                        {plan.cta}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enterprise Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Solution</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Looking for a custom solution for your university or institution? 
                  We offer tailored enterprise packages with advanced features and dedicated support.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="w-6 h-6 text-brand-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg">
                  <Link href="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Scholarship?
          </h2>
          <p className="text-xl text-brand-blue-100 mb-8">
            Join over 50,000 students who have found their ideal funding opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">
                Start Free Today
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-brand-blue-600"
            >
              <Link href="/applicant/scholarships">
                Browse Scholarships
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}