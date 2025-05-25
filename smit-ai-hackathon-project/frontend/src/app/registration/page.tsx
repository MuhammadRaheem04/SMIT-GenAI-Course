import RegistrationForm from '@/components/RegistrationForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Registration - Saylani Mass IT Training',
  description: 'Register for comprehensive IT training programs including Web Development, Mobile Apps, AI, Data Science, and more at Pakistan\'s largest IT training institute.',
  keywords: 'student registration, IT courses, programming bootcamp, web development course, mobile app development, AI training, Pakistan',
}

export default function RegistrationPage() {
  return <RegistrationForm />
}