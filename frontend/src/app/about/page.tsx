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
      <section className="bg-pastel-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              About EduMatch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to democratize access to education by connecting students 
              with the right scholarships and research opportunities using AI-powered matching.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="text-sm bg-blue-100 text-blue-700 border-blue-200">Founded in 2022</Badge>
              <Badge className="text-sm bg-purple-100 text-purple-700 border-purple-200">AI-Powered</Badge>
              <Badge className="text-sm bg-cyan-100 text-cyan-700 border-cyan-200">Global Reach</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 section-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card text-center">
                <div className="flex justify-center mb-4">
                  <div className={`stat-icon ${
                    index === 0 ? 'bg-icon-blue' : 
                    index === 1 ? 'bg-icon-green' : 
                    index === 2 ? 'bg-icon-purple' : 
                    'bg-icon-orange'
                  }`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="stat-number text-gradient-blue">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-pastel-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gradient-primary mb-6">Our Story</h2>
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
              <Card className="card-gradient-blue card-hover">
                <CardContent className="p-8">
                  <div className="bg-icon-blue w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-scale-hover">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    To make quality education accessible to everyone by connecting students 
                    with the right opportunities at the right time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at EduMatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`
                ${index === 0 ? 'card-gradient-blue' : 
                  index === 1 ? 'card-gradient-cyan' : 
                  index === 2 ? 'card-gradient-purple' : 
                  'card-gradient-blue'} card-hover
              `}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center 
                      ${index === 0 ? 'bg-icon-blue' : 
                        index === 1 ? 'bg-icon-orange' : 
                        index === 2 ? 'bg-icon-cyan' : 
                        'bg-icon-green'} animate-scale-hover`}>
                      <value.icon className="w-6 h-6 text-white" />
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
      <section className="py-16 section-gradient-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals working to make education more accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className={`
                ${index % 4 === 0 ? 'card-gradient-blue' : 
                  index % 4 === 1 ? 'card-gradient-cyan' : 
                  index % 4 === 2 ? 'card-gradient-purple' : 
                  'card-gradient-blue'} card-hover
              `}>
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200 ring-4 ring-white shadow-lg"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">
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
      <section className="py-16 bg-pastel-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gradient-primary mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their ideal scholarships through EduMatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/auth/register">
                Get Started for Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-lg">
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