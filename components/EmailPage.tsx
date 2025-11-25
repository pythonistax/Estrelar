'use client'

import { copy } from '@/lib/config'
import { useState } from 'react'
import { getSessionMetadata } from '@/lib/session'

interface EmailPageProps {
  onContinue: (email: string, privacyConsent: boolean, marketingConsent: boolean) => void
  onBack?: () => void
  sessionId?: string
  quizAnswers?: Record<number, string | string[]>
  shouldSubmit?: boolean // Whether to submit immediately or just pass data
}

export default function EmailPage({ onContinue, onBack, sessionId, quizAnswers, shouldSubmit = true }: EmailPageProps) {
  const emailPage = copy.emailPage
  const [email, setEmail] = useState('')
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [marketingChecked, setMarketingChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && privacyChecked && !isSubmitting) {
      setIsSubmitting(true)
      
      // If shouldSubmit is true, submit immediately (old behavior)
      if (shouldSubmit) {
        try {
          // Get session metadata
          const sessionData = getSessionMetadata()
          
          // Prepare data to send
          const submissionData = {
            email: email.trim(),
            sessionId: sessionId || sessionData.sessionId,
            createdAt: sessionData.createdAtISO,
            privacyConsent: privacyChecked,
            marketingConsent: marketingChecked,
            quizAnswers: quizAnswers || {},
            submittedAt: new Date().toISOString()
          }

          const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/save-email'
          
          // Send to backend API
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
          })

          if (!response.ok) {
            console.error('Failed to save email:', response.statusText)
          } else {
            const result = await response.json()
            console.log('Email saved successfully:', result)
          }
        } catch (error) {
          console.error('Error saving email:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
      
      // Always continue to next page (pass email and consents)
      onContinue(email.trim(), privacyChecked, marketingChecked)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="fixed top-0 left-0 z-10 flex h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto flex w-full max-w-[400px] flex-col laptop:max-w-[1128px]">
          <div className="laptop:flex-grow" style={{ opacity: 1 }}>
            {/* Header */}
            <nav className="flex h-12 items-center justify-center border-b-2 border-secondary px-4 tablet:h-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="139" height="50" viewBox="0 -5 139 55">
                <defs>
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}
                  </style>
                </defs>
                <text 
                  x="0" 
                  y="35" 
                  fontFamily="Pacifico, cursive" 
                  fontSize="28" 
                  fontWeight="400" 
                  fill="var(--text-accent, #5653FE)"
                  letterSpacing="0.5"
                >
                  28Days
                </text>
              </svg>
            </nav>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 pb-[100px] laptop:h-full laptop:px-10">
              <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-6 laptop:flex-grow laptop:gap-8">
                {/* Title */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-xl font-bold leading-[30px] text-main laptop:text-2xl">
                    {emailPage.title}{' '}
                    <span className="text-accent-main font-bold">
                      {emailPage.titleAccent}
                    </span>
                  </h1>
                </div>

                {/* Email Input */}
                <div className="w-full max-w-[400px] laptop:max-w-[500px]">
                  <div className="relative">
                    {/* Envelope Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 5.83333L10 11.6667L17.5 5.83333M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={emailPage.placeholder}
                      className="w-full rounded-lg border border-gray-300 bg-white px-12 py-4 text-base text-main placeholder:text-gray-400 focus:border-accent-main focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex w-full max-w-[400px] flex-col gap-4 laptop:max-w-[500px]">
                  {/* Privacy Policy Checkbox */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                      className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-accent-main focus:ring-2 focus:ring-accent-main"
                      required
                    />
                    <span className="text-sm text-main">
                      {emailPage.checkboxes[0].text}{' '}
                      <a href={emailPage.checkboxes[0].linkHref} className="underline text-main">
                        {emailPage.checkboxes[0].linkText}
                      </a>
                      {emailPage.checkboxes[0].textAfter}
                    </span>
                  </label>

                  {/* Marketing Checkbox */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={marketingChecked}
                      onChange={(e) => setMarketingChecked(e.target.checked)}
                      className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-accent-main focus:ring-2 focus:ring-accent-main"
                    />
                    <span className="text-sm text-main">
                      {emailPage.checkboxes[1].text}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="w-full max-w-[400px] laptop:max-w-[500px]">
                  <button
                    type="submit"
                    disabled={!email || !privacyChecked}
                    className={`w-full rounded-lg p-4 text-base font-semibold uppercase transition-all ${
                      email && privacyChecked
                        ? 'bg-accent-main text-white shadow-[0px_8px_24px_0px_var(--shadow-accent-main)] hover:opacity-90'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {emailPage.button}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

