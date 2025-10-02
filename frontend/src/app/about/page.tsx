'use client';

import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  BookOpen,
  Heart,
  Globe,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Dr. Sarah Wilson',
      role: 'Founder & CEO',
      education: 'PhD in Education Technology, Stanford',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      education: 'MS Computer Science, MIT',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of AI',
      education: 'PhD Machine Learning, UC Berkeley',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    {
      name: 'David Kumar',
      role: 'Head of Partnerships',
      education: 'MBA Harvard Business School',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    }
  ];

  const stats = [
    {
      number: '50,000+',
      label: 'Students Helped',
      icon: Users
    },
    {
      number: '2,000+',
      label: 'Scholarships Listed',
      icon: Award
    },
    {
      number: '$500M+',
      label: 'Total Awards Matched',
      icon: TrendingUp
    },
    {
      number: '200+',
      label: 'Partner Institutions',
      icon: Globe
    }
  ];

  const values = [
    {
      title: 'Accessibility',
      description: 'Making education opportunities accessible to all students regardless of background.',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Innovation',
      description: 'Using cutting-edge AI technology to create smarter matching algorithms.',
      icon: Lightbulb,
      color: 'text-yellow-600'
    },
    {
      title: 'Excellence',
      description: 'Maintaining the highest standards in everything we do for our users.',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Community',
      description: 'Building a supportive ecosystem for students, providers, and institutions.',
      icon: Users,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About EduMatch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to democratize access to education by connecting students 
              with the right scholarships and research opportunities using AI-powered matching.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="text-sm">Founded in 2022</Badge>
              <Badge variant="secondary" className="text-sm">AI-Powered</Badge>
              <Badge variant="secondary" className="text-sm">Global Reach</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-brand-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-brand-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  EduMatch was born from a simple observation: too many talented students 
                  miss out on educational opportunities simply because they don't know they exist.
                </p>
                <p>
                  Our founder, Dr. Sarah Wilson, experienced this firsthand during her PhD journey. 
                  Despite being highly qualified, she spent countless hours manually searching 
                  through hundreds of scholarship databases, often missing deadlines or 
                  discovering relevant opportunities too late.
                </p>
                <p>
                  We realized that technology could solve this problem. By leveraging artificial 
                  intelligence and machine learning, we could create a platform that automatically 
                  matches students with the most relevant opportunities based on their background, 
                  interests, and goals.
                </p>
                <p>
                  Today, EduMatch has helped over 50,000 students find and secure educational 
                  funding, representing more than $500 million in total awards.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <BookOpen className="w-16 h-16 text-brand-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To make quality education accessible to everyone by connecting students 
                  with the right opportunities at the right time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at EduMatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${value.color}`}>
                      <value.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals working to make education more accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-blue-600 text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {member.education}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-brand-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their ideal scholarships through EduMatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">
                Get Started for Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-blue-600">
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