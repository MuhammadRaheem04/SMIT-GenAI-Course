import { NextRequest, NextResponse } from 'next/server'
import { insertRegistrationSchema } from '@/lib/shared/schema'
import { storage } from '@/lib/storage'
import { fromZodError } from 'zod-validation-error'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ✅ Step 1: Validate input
    const validationResult = insertRegistrationSchema.safeParse(body)

    if (!validationResult.success) {
      const errorMessage = fromZodError(validationResult.error).toString()
      console.warn("❌ Validation failed:", errorMessage)
      return NextResponse.json({
        message: 'Validation failed',
        errors: errorMessage,
      }, { status: 400 })
    }

    const registrationData = validationResult.data
    console.log("📝 Registration data received:", registrationData)

    // ✅ Step 2: Check for duplicate email
    const existingRegistration = await storage.getRegistrationByEmail(registrationData.email)
    if (existingRegistration) {
      console.warn("⚠️ Email already registered:", registrationData.email)
      return NextResponse.json({
        message: 'Email already registered',
      }, { status: 409 })
    }

    // ✅ Step 3: Create new registration
    const registration = await storage.createRegistration(registrationData)
    console.log("✅ Registration saved with ID:", registration.id)

    // ✅ Step 4: Trigger ID card generation in backend
    console.log("➡️ Calling backend to generate ID card...")

    try {
      const response = await fetch('http://localhost:5000/generateCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          registrationId: registration.id,
          createdAt: new Date(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("❌ ID card generation failed:", result)
      } else {
        console.log("✅ ID card generation success:", result)
      }

    } catch (cardError) {
      console.error("❌ Network error calling /generateCard:", cardError)
    }

    // ✅ Step 5: Respond to client
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Check WhatsApp or Email for your Digital ID Card.',
      registrationId: registration.id,
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      message: 'Registration failed. Please try again.',
    }, { status: 500 })
  }
}
