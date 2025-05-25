import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saylani Mass IT Training - Student Registration',
  description: 'Join Pakistan\'s largest IT training program. Register for comprehensive courses in Web Development, Mobile Apps, AI, and more.',
  keywords: 'IT training, programming courses, web development, Pakistan, Saylani, education',
  authors: [{ name: 'Saylani Mass IT Training' }],
  openGraph: {
    title: 'Saylani Mass IT Training - Student Registration',
    description: 'Transform your career with cutting-edge IT skills. Register now for free training programs.',
    type: 'website',
    locale: 'en_US',
  },
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Dialogflow Messenger Script */}
        <script
          src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
          async
        ></script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}