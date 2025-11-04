import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/lib/auth'
import { AppProvider } from '@/contexts/AppContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { RealTimeProvider } from '@/providers/RealTimeProvider'
import { RealTimeIndicator } from '@/components/RealTimeIndicator'
import { MessagingWidget } from '@/components/messaging/MessagingWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduMatch - Smart Platform for Scholarships and Research Opportunities',
  description: 'Connect students with research opportunities and scholarships using AI-powered matching.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AppProvider>
            <AuthProvider>
              <RealTimeProvider>
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <RealTimeIndicator />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <MessagingWidget />
                </div>
              </RealTimeProvider>
            </AuthProvider>
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
