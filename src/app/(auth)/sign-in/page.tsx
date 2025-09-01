import { SignInForm } from '@/components/auth/SignInForm'
import React from 'react'

const SignInPage = () => {
  return (
  <div className="w-full">
        <div className="max-w-[450px] mx-auto">
          <SignInForm />
        </div>
      </div>
  )
}

export default SignInPage