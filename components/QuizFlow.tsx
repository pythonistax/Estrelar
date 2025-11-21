'use client'

import { useState, useEffect } from 'react'
import { copy } from '@/lib/config'
import { getSessionId, getSessionMetadata } from '@/lib/session'
import TeaserPage from './TeaserPage'
import EndPage from './EndPage'
import UserProfilePage from './UserProfilePage'
import PersonalPlanPage from './PersonalPlanPage'
import MagicPage from './MagicPage'
import EmailPage from './EmailPage'
import NamePage from './NamePage'
import ScratchPage from './ScratchPage'

interface QuizFlowProps {
  onBack?: () => void
}

export default function QuizFlow({ onBack }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]) // For multi-select
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [showTeaser, setShowTeaser] = useState(false)
  const [showEndPage, setShowEndPage] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showPersonalPlan, setShowPersonalPlan] = useState(false)
  const [showMagicPage, setShowMagicPage] = useState(false)
  const [showEmailPage, setShowEmailPage] = useState(false)
  const [showNamePage, setShowNamePage] = useState(false)
  const [showScratchPage, setShowScratchPage] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [userName, setUserName] = useState<string>('') // Store user name
  const [userEmail, setUserEmail] = useState<string>('') // Store user email
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const steps = copy.quiz.steps
  const totalSteps = 20 // Total quiz steps

  // Generate session ID when quiz starts
  useEffect(() => {
    const session = getSessionId()
    setSessionId(session)
  }, [])

  // Load/reset selectedAnswers when currentStep changes
  useEffect(() => {
    const currentQuestion = steps[currentStep]
    const isMultiSelect = currentQuestion?.allowMultiple
    
    if (isMultiSelect) {
      // Load saved answers if they exist
      const savedAnswers = answers[currentStep]
      if (savedAnswers && Array.isArray(savedAnswers)) {
        setSelectedAnswers(savedAnswers)
      } else {
        setSelectedAnswers([])
      }
    } else {
      // Reset for non-multi-select questions
      setSelectedAnswers([])
    }
  }, [currentStep, steps, answers])

  const handleAnswer = (answer: string) => {
    const currentQuestion = steps[currentStep]
    const isMultiSelect = currentQuestion?.allowMultiple
    
    if (isMultiSelect) {
      // Handle multi-select
      setSelectedAnswers((prev) => {
        if (prev.includes(answer)) {
          // Remove if already selected
          return prev.filter((a) => a !== answer)
        } else {
          // Add if not selected
          return [...prev, answer]
        }
      })
    } else {
      // Handle single-select
      setSelectedAnswer(answer)
      
      // Save the answer
      const newAnswers = { ...answers, [currentStep]: answer }
      setAnswers(newAnswers)
      
      // Special condition: If we're on question 19 (index 18), show personal plan page for ANY answer
      if (currentStep === 18) {
        setTimeout(() => {
          setShowPersonalPlan(true)
          setSelectedAnswer(null)
        }, 300)
        return
      }
      
      // Special condition: If we're on question 17 (index 16), show user profile for ANY answer
      if (currentStep === 16) {
        setTimeout(() => {
          setShowUserProfile(true)
          setSelectedAnswer(null)
        }, 300)
        return
      }
      
      // Special condition: If we're on question 5, show teaser for ANY answer (quiz ends after question 5)
      if (currentStep === 4) {
        setTimeout(() => {
          setShowTeaser(true)
          setSelectedAnswer(null)
        }, 300)
        return
      }
      
      // Check if we should show teaser page based on conditions
      const conditions = copy.quizConditions?.showTeaserOn || []
      const shouldShowTeaser = conditions.some((condition: any) => {
        const questionId = condition.questionId
        const questionIndex = questionId - 1 // Convert to 0-based index
        return currentStep === questionIndex && answer === condition.answer
      })
      
      if (shouldShowTeaser) {
        setTimeout(() => {
          setShowTeaser(true)
          setSelectedAnswer(null)
        }, 300)
        return
      }
      
      // Auto-advance after selection
      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
          setSelectedAnswer(null)
        }, 300)
      } else {
        // Quiz completed - show end page
        setTimeout(() => {
          setShowEndPage(true)
          setSelectedAnswer(null)
        }, 300)
      }
    }
  }

  const handleMultiSelectContinue = () => {
    // Save multi-select answers
    const newAnswers = { ...answers, [currentStep]: selectedAnswers }
    setAnswers(newAnswers)
    
    // Reset multi-select state
    setSelectedAnswers([])
    
      // Advance to next question
    if (currentStep < steps.length - 1) {
      // Special condition: If next question is 19 (index 18), show personal plan page
      if (currentStep + 1 === 18) {
        setTimeout(() => {
          setShowPersonalPlan(true)
          setSelectedAnswer(null)
        }, 300)
      } else {
        setCurrentStep((prev) => prev + 1)
        setSelectedAnswer(null)
      }
    } else {
      // Quiz completed - show end page
      setShowEndPage(true)
      setSelectedAnswer(null)
    }
  }

  const handleTeaserContinue = () => {
    // Continue to next step after teaser (question 6)
    setShowTeaser(false)
    // After teaser, go to question 6 (index 5)
    setCurrentStep(5)
    setSelectedAnswer(null)
  }

  const handleEndPageContinue = () => {
    // Handle what happens after end page - could redirect to results, email capture, etc.
    console.log('End page continue clicked')
    // For now, just log - you can add redirect logic here later
  }

  const handleUserProfileContinue = () => {
    // Continue after user profile - could go to next question or final page
    setShowUserProfile(false)
    // After user profile, continue to next question (question 18, index 17)
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      // If no more questions, show end page
      setShowEndPage(true)
      setSelectedAnswer(null)
    }
  }

  const handlePersonalPlanContinue = () => {
    // Continue after personal plan page - show magic page
    setShowPersonalPlan(false)
    setShowMagicPage(true)
    setSelectedAnswer(null)
  }

  const handleMagicPageContinue = () => {
    // Continue after magic page - show email page
    setShowMagicPage(false)
    setShowEmailPage(true)
    setSelectedAnswer(null)
  }

  const handleEmailPageContinue = (email: string, privacy: boolean, marketing: boolean) => {
    // Store email and consent info, then show name page
    setUserEmail(email)
    setPrivacyConsent(privacy)
    setMarketingConsent(marketing)
    // Ensure all other pages are hidden
    setShowEmailPage(false)
    setShowEndPage(false) // Make sure end page is not shown
    setShowNamePage(true) // Show name page
    setSelectedAnswer(null)
  }

  const handleNameSubmit = async (name: string) => {
    // Store name
    setUserName(name.trim())
    
    // Submit email + name + quiz data together after name is collected
    if (userEmail && name.trim()) {
      try {
        const sessionData = getSessionMetadata()
        const submissionData = {
          email: userEmail.trim(),
          name: name.trim(),
          sessionId: sessionId || sessionData.sessionId,
          createdAt: sessionData.createdAtISO,
          privacyConsent: privacyConsent,
          marketingConsent: marketingConsent,
          quizAnswers: answers || {},
          submittedAt: new Date().toISOString()
        }

        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/save-email'
        
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        })

        if (!response.ok) {
          console.error('Failed to save email and name:', response.statusText)
          // Continue anyway - don't block user if API fails
        } else {
          const result = await response.json()
          console.log('Email and name saved successfully:', result)
        }
      } catch (error) {
        console.error('Error saving email and name:', error)
        // Continue anyway - don't block user if API fails
      }
    }
    
    // After name submission - show scratch page (only after name is entered)
    setShowNamePage(false)
    setShowScratchPage(true)
  }

  const handleScratchComplete = () => {
    // After scratch page - show end page
    setShowScratchPage(false)
    setShowEndPage(true)
  }

  const getOptionValue = (option: any): string => {
    return typeof option === 'string' ? option : option.text
  }

  const handleBackClick = () => {
    if (showScratchPage) {
      setShowScratchPage(false)
      setShowNamePage(true)
      setSelectedAnswers([])
    } else if (showNamePage) {
      setShowNamePage(false)
      setShowEmailPage(true)
      setSelectedAnswers([])
    } else if (showEmailPage) {
      setShowEmailPage(false)
      setShowMagicPage(true)
      setSelectedAnswer(null)
      setSelectedAnswers([])
    } else if (showMagicPage) {
      setShowMagicPage(false)
      setShowPersonalPlan(true)
      setSelectedAnswer(null)
      setSelectedAnswers([])
    } else if (showPersonalPlan) {
      setShowPersonalPlan(false)
      setCurrentStep(18) // Go back to question 19
      setSelectedAnswer(null)
      setSelectedAnswers([])
    } else if (showUserProfile) {
      setShowUserProfile(false)
      setCurrentStep(16) // Go back to question 17
      setSelectedAnswer(null)
      setSelectedAnswers([])
    } else if (showEndPage) {
      setShowEndPage(false)
      setCurrentStep(steps.length - 1) // Go back to last question
      setSelectedAnswers([])
    } else if (showTeaser) {
      setShowTeaser(false)
      setCurrentStep(4) // Go back to question 5
      setSelectedAnswers([])
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setSelectedAnswer(null)
      setSelectedAnswers([])
    } else if (onBack) {
      onBack()
    }
  }

  const progress = ((currentStep + 1) / totalSteps) * 100

  // Show scratch page after name page
  if (showScratchPage) {
    return <ScratchPage onComplete={handleScratchComplete} onBack={handleBackClick} />
  }

  // Show name page after email page
  if (showNamePage) {
    return <NamePage onSubmit={handleNameSubmit} onBack={handleBackClick} />
  }

  // Show email page after magic page
  if (showEmailPage) {
    return (
      <EmailPage 
        onContinue={handleEmailPageContinue} 
        onBack={handleBackClick}
        sessionId={sessionId}
        quizAnswers={answers}
        shouldSubmit={false} // Don't submit yet, wait for name
      />
    )
  }

  // Show magic page after personal plan page
  if (showMagicPage) {
    return <MagicPage onContinue={handleMagicPageContinue} onBack={handleBackClick} />
  }

  // Show personal plan page after question 19
  if (showPersonalPlan) {
    return <PersonalPlanPage onContinue={handlePersonalPlanContinue} onBack={handleBackClick} />
  }

  // Show user profile page after question 17
  if (showUserProfile) {
    return <UserProfilePage onContinue={handleUserProfileContinue} onBack={handleBackClick} />
  }

  // Show end page if quiz is completed
  if (showEndPage) {
    return <EndPage onContinue={handleEndPageContinue} onBack={handleBackClick} />
  }

  // Show teaser page if condition is met
  if (showTeaser) {
    return <TeaserPage onContinue={handleTeaserContinue} onBack={handleBackClick} />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="relative z-10 mx-auto flex h-full min-h-full w-full max-w-[400px] flex-col tablet:max-w-full pb-[104px] gap-6">
        {/* Header */}
        <div className="h-12 tablet:h-16">
          <div className="relative flex h-full items-center justify-center">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackClick}
              className="absolute left-4 top-[50%] -translate-y-1/2 cursor-pointer border-0 bg-transparent fill-accent-secondary p-0"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="fill-[var(--text-main)]">
                <path d="M11.707 5.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0Z"></path>
              </svg>
            </button>

            {/* Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="99" height="30">
              <path fill="var(--text-accent, #5653FE)" d="M20.233 21.254c-2.068 0-3.822-1.225-4.541-3.17-.764-2.027-.495-4.858.674-7.816.45-1.057.945-2.028 1.529-2.916 2.113 1.057 4.406 1.902 6.97 1.902 3.012 0 6.025-1.48 6.069-4.733C30.979 2.24 28.596 0 25.224 0c-2.878 0-5.755 1.268-8.048 3.507C14.208 1.817 11.016 0 7.464 0 3.642 0 0 2.62 0 6.507c0 3.043 2.473 5.62 5.8 5.62 2.968 0 5.396-2.113 5.396-4.944 0-1.14-.764-2.282-1.664-2.789L7.644 6.296c.27.254.405.718.405 1.014 0 1.014-1.125 1.86-2.339 1.86-1.484 0-2.562-1.184-2.562-2.663 0-2.24 2.247-3.55 4.316-3.55 2.652 0 5.126 1.437 7.733 2.916a17.74 17.74 0 0 0-2.023 3.972c-1.484 4.099-1.439 7.564-.09 10.141 1.574 3 4.631 4.015 7.014 4.015 3.867 0 8.004-2.24 10.162-7.31l-2.608-.592c-.944 2.493-3.867 5.155-7.419 5.155Zm4.811-18.508c1.979 0 2.923.972 2.923 1.86 0 1.098-1.26 1.859-3.058 1.859-1.663 0-3.282-.634-4.99-1.48 1.573-1.436 3.416-2.239 5.125-2.239Z"></path>
              <path fill="url(#logo_svg__a)" d="M17.174 3.507C14.207 1.817 11.014 0 7.462 0v2.958c2.653 0 5.126 1.436 7.734 2.915.611-.854 1.3-1.649 1.978-2.366Z" opacity="0.51"></path>
              <path fill="url(#logo_svg__b)" d="M27.967 4.606c0 1.098-1.259 1.859-3.057 1.859-1.664 0-3.283-.634-4.991-1.48-.696.656-1.357 1.421-2.024 2.368 2.114 1.056 4.407 1.901 6.97 1.901 3.012 0 6.025-1.48 6.07-4.733l-2.968.085Z" opacity="0.51"></path>
              <path fill="var(--text-accent, #5653FE)" d="M41.19 16.098c-.45 1.48-1.439 2.029-2.338 2.029-.135 0-.225 0-.36-.043 1.259-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169-3.057 0-5.665 2.155-6.879 5.832-1.349 4.183-.045 7.436 3.058 8.24.404.084.809.126 1.214.126 1.978 0 4.091-1.141 5.53-3.38.405.126.854.168 1.484.168 1.664 0 3.911-.718 5.036-4.098l-2.654-.592Zm-5.126-.084c-1.214.295-1.978 2.366-1.169 3.127-.99 1.52-2.293 2.324-3.327 2.155-1.574-.296-2.248-2.198-1.17-5.113.945-2.535 2.969-4.099 4.452-3.592.99.338 1.529 1.564 1.214 3.423Z"></path>
              <path fill="url(#logo_svg__c)" d="M34.85 12.591c.99.338 1.529 1.564 1.214 3.423-.026.835.947 1.81 2.428 2.07 1.26-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169l.45 2.79Z" opacity="0.51"></path>
              <path fill="url(#logo_svg__d)" d="M34.896 19.14c-.99 1.522-2.294 2.325-3.328 2.156l-.989 2.577c.405.084.81.127 1.214.127 1.978 0 4.092-1.141 5.53-3.38-1.237-.312-2.108-1.02-2.427-1.48Z" opacity="0.51"></path>
              <path fill="var(--text-accent, #5653FE)" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.113-7.31h3.013L43.6 17.83c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.676 3.237-6.212l.81-2.789h3.012l-2.518 8.832c-.36 1.225-.54 2.24.045 2.45.81.296 2.473-1.52 3.822-5.324l2.652.592C56.415 20.873 54.481 24 51.244 24c-1.618 0-2.832-1.31-2.967-2.747Z"></path>
              <path fill="url(#logo_svg__e)" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.922.38c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.677 3.237-6.212-.58 2.112-2.084 6.205-1.843 8.324Z" opacity="0.51"></path>
              <path fill="var(--text-accent, #5653FE)" d="M57.832 20.493c.18-3.043 2.742-5.07 3.687-7.141l-2.608-.803c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647-.584-.465-.944-1.775.045-2.494.81-.59 2.069-.295 2.653.55.809.338 2.563.803 4.316 1.352.944.296 1.709.507 1.979 1.14.27.635-.405 1.564-1.844 3.508-1.034 1.394-2.698 3.465-2.652 4.732 0 .592.404.93.944.93 1.123 0 3.192-1.352 4.63-5.282l2.654.592C67.228 21.507 64.71 24 61.564 24c-2.158 0-3.867-1.521-3.732-3.507Z"></path>
              <path fill="url(#logo_svg__f)" d="M58.911 12.549c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647.457.369 1.782.607 2.608.887Z" opacity="0.51"></path>
              <path fill="url(#logo_svg__g)" d="M57.831 20.493c.18-3.043 2.743-5.07 3.687-7.141 1.286.377 2.693.969 2.765 1.23-.24.336-.517.712-.831 1.136-1.035 1.394-2.698 3.465-2.653 4.732l-2.968.043Z" opacity="0.51"></path>
              <path fill="var(--text-accent, #5653FE)" d="m77.755 16.69-2.653-.592c-.584 1.648-1.664 2.831-3.147 3.803-1.799-3.084-3.912-4.986-3.418-6.422.27-.888 1.215-1.226 1.98-.972.674.211.898.93.898 1.14l2.248-.802c-.045-.465-.27-1.141-.674-1.69-.675-.888-1.798-1.353-3.012-1.353-2.204 0-3.688 1.226-4.182 3-.9 3.296 2.203 5.79 3.732 8.41-.72.337-1.53.675-2.338 1.013-3.957 1.648-4.856 3.465-4.496 5.07.36 1.522 1.933 2.705 4.091 2.705 3.732 0 7.149-3.38 6.205-7.606 1.798-1.183 3.687-2.62 4.766-5.704ZM67.234 27.38c-.9.17-1.574-.042-1.664-.507-.09-.38.09-1.014 1.844-1.859.989-.465 1.933-.845 2.877-1.226-.045 2.198-2.113 3.423-3.057 3.592Z"></path>
              <path fill="url(#logo_svg__h)" d="M71.954 19.901c-1.798-3.084-3.912-4.986-3.417-6.423l-2.743-.675c-.9 3.295 2.203 5.788 3.732 8.408.835-.372 2.051-1.029 2.428-1.31Z" opacity="0.51"></path>
              <path fill="url(#logo_svg__i)" d="M70.291 23.789c-.045 2.197-2.114 3.422-3.057 3.591l-.45 2.62c3.732 0 7.149-3.38 6.205-7.606-.59.439-1.897 1.084-2.698 1.395Z" opacity="0.51"></path>
              <path fill="var(--text-accent, #5653FE)" d="M74.393 22.352c-.404-.845-.54-2.282.045-4.268l2.293-7.943h3.013l-2.518 8.83c-.36 1.226-.54 2.24.044 2.451.81.296 2.474-1.52 3.823-5.323l2.652.591C82.216 20.873 80.283 24 77.046 24c-1.304 0-2.293-.887-2.653-1.648ZM79.069 5.07c1.034 0 1.664.676 1.664 1.563 0 .888-.72 1.606-1.664 1.606s-1.708-.718-1.708-1.606c0-.887.764-1.563 1.708-1.563Z"></path>
              <path fill="var(--text-accent, #5653FE)" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733-4.137 0-5.081-4.352-4.407-7.31.675-2.916 1.844-5.113 2.833-6.55h3.102c-1.124 1.69-2.383 4.268-2.922 6.465-.63 2.536-.27 4.606 1.259 4.817 1.798.254 3.641-1.774 4.361-5.197.315-1.521.45-3.38.315-5.028l2.832-1.057c0 2.705-.18 7.606 2.024 7.564.81 0 1.393-.718 1.664-1.606l2.652.592c-1.214 3.296-3.192 3.718-4.496 3.718-1.034 0-2.518-.676-2.877-1.14Z"></path>
              <path fill="url(#logo_svg__j)" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733l-.135-2.578c1.798.254 3.642-1.774 4.361-5.197.18-.872.302-1.856.347-2.847.027 1.087-.211 4.156 1.767 5.89Z" opacity="0.51"></path>
              <defs>
                <linearGradient id="logo_svg__a" x1="18.495" x2="12.739" y1="6.66" y2="3.037" gradientUnits="userSpaceOnUse"><stop offset="0.15"></stop><stop offset="0.826" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__b" x1="17.352" x2="25.412" y1="1.21" y2="7.318" gradientUnits="userSpaceOnUse"><stop offset="0.226"></stop><stop offset="0.629" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__c" x1="34.09" x2="36.058" y1="18.066" y2="14.168" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__d" x1="36.758" x2="34.283" y1="17.899" y2="21.63" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__e" x1="51.856" x2="45.737" y1="17.753" y2="18.753" gradientUnits="userSpaceOnUse"><stop offset="0.215"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__f" x1="58.38" x2="57.042" y1="9.483" y2="15.22" gradientUnits="userSpaceOnUse"><stop offset="0.203"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__g" x1="63.866" x2="61.623" y1="12.562" y2="16.557" gradientUnits="userSpaceOnUse"><stop offset="0.056"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__h" x1="72.648" x2="69.804" y1="22.735" y2="18.002" gradientUnits="userSpaceOnUse"><stop offset="0.14"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__i" x1="67.726" x2="69.766" y1="22.971" y2="26.421" gradientUnits="userSpaceOnUse"><stop offset="0.151"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                <linearGradient id="logo_svg__j" x1="93.117" x2="86.856" y1="15.042" y2="20.618" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
              </defs>
            </svg>

            {/* Progress Counter */}
            <div className="absolute right-4 top-[50%] -translate-y-1/2">
              <div className="text-xs font-semibold text-main">
                <span className="text-accent">{currentStep + 1} /</span> {totalSteps}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-1">
          <div className="relative overflow-hidden rounded-2xl bg-navigation">
            <div
              className="duration-[400ms] bg-accent-main transition-all ease-in-out"
              style={{ width: `${progress}%`, height: '4px' }}
            ></div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="h-full w-full">
          <div className="relative flex h-full flex-col gap-5" style={{ opacity: 1 }}>
            {/* Question Header */}
            <div className="flex-initial w-full space-y-2 px-4 mx-auto text-center max-w-[400px] laptop:max-w-[560px]">
              <h1 className="text-2xl font-bold leading-9 text-main">
                {steps[currentStep]?.question || 'What is your age?'}
              </h1>
              {steps[currentStep]?.subtitle && (
                <p className="text-base font-medium leading-[24px] text-secondary">
                  {steps[currentStep].subtitle}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="w-full flex-1 px-4 pb-[34px]" id="quiz-page">
              <div className="mx-auto flex max-w-[400px] flex-col gap-6 tablet:max-w-[580px]">
                {steps[currentStep]?.gridLayout ? (
                  // Grid layout for multi-select questions
                  steps[currentStep]?.horizontalCardLayout ? (
                    // 2-column grid with horizontal cards (icon left, text right) - Question 15
                    <div className={`grid ${steps[currentStep]?.gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-3 w-full`}>
                      {(steps[currentStep]?.options || []).map((option: any, index: number) => {
                        const optionValue = getOptionValue(option)
                        const isSelected = selectedAnswers.includes(optionValue)
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswer(optionValue)}
                            className={`group relative flex items-center gap-3 rounded-lg border-2 p-3 transition-all min-h-[80px] w-full ${
                              isSelected
                                ? 'bg-question-fill-selected border-main'
                                : 'bg-question-fill-unselected border-transparent'
                            }`}
                            data-cy-id={`quiz-button-grid-${index}`}
                            data-testid={`quiz-button-grid-${index}`}
                          >
                            {/* Image on left */}
                            {option.image && (
                              <div
                                className="w-12 h-12 flex-shrink-0 bg-contain bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: `url("${option.image}")`,
                                }}
                              ></div>
                            )}
                            {/* Text on right */}
                            <span className="text-sm font-bold text-main text-left leading-tight flex-1">
                              {optionValue}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    // 3-column grid with vertical cards (icon top, text bottom) - Question 10
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {(steps[currentStep]?.options || []).map((option: any, index: number) => {
                        const optionValue = getOptionValue(option)
                        const isSelected = selectedAnswers.includes(optionValue)
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswer(optionValue)}
                            className={`group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all min-h-[110px] w-full ${
                              isSelected
                                ? 'bg-question-fill-selected border-main'
                                : 'bg-question-fill-unselected border-transparent'
                            }`}
                            data-cy-id={`quiz-button-grid-${index}`}
                            data-testid={`quiz-button-grid-${index}`}
                          >
                            {/* Image */}
                            {option.image && (
                              <div
                                className="w-14 h-14 bg-contain bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: `url("${option.image}")`,
                                }}
                              ></div>
                            )}
                            {/* Text */}
                            <span className="text-xs font-bold text-main text-center leading-tight px-1">
                              {optionValue}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-5">
                    {steps[currentStep]?.hasImages ? (
                      // Question with images (e.g., Question 2)
                      (steps[currentStep]?.options || []).map((option: any, index: number) => {
                        const optionValue = getOptionValue(option)
                        const isMultiSelect = steps[currentStep]?.allowMultiple
                        const isSelected = isMultiSelect 
                          ? selectedAnswers.includes(optionValue)
                          : selectedAnswer === optionValue
                        return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(optionValue)}
                          className={`group relative flex min-h-[80px] content-start items-center justify-between gap-1 rounded-lg border border-transparent text-left pr-16 max-[375px]:pr-8 transition-all ${
                            isSelected
                              ? 'bg-question-fill-selected border-main'
                              : 'bg-question-fill-unselected'
                          }`}
                          data-cy-id={`quiz-button-single-select-${index}`}
                          data-testid={`quiz-button-single-select-${index}`}
                        >
                          {/* Image */}
                          <div className="h-fit w-fit contents">
                            <div
                              className="flex-none bg-contain bg-center bg-no-repeat h-[105px] w-[105px]"
                              style={{
                                backgroundImage: option.image ? `url("${option.image}")` : 'none',
                              }}
                            ></div>
                          </div>
                          {/* Text */}
                          <div className="flex w-full flex-col justify-start mr-4">
                            <span className="text flex-1 font-bold text-main text-base">
                              {optionValue}
                            </span>
                            {typeof option === 'object' && option.subtitle && (
                              <span className="text-sm font-normal text-secondary mt-1">
                                {option.subtitle}
                              </span>
                            )}
                          </div>
                        </button>
                        )
                      })
                    ) : (
                    // Question without images (e.g., Question 1, Question 6 with emojis)
                    <div className="flex w-[60%] flex-col gap-5 tablet:w-full">
                      {(steps[currentStep]?.options || ['18-24', '25-34', '35-44', '45+']).map((option: any, index: number) => {
                        const optionValue = getOptionValue(option)
                        const emoji = typeof option === 'object' && option.emoji ? option.emoji : null
                        return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(optionValue)}
                          className={`group relative flex min-h-[80px] content-start items-center justify-between gap-1 rounded-lg border border-transparent !px-0 text-center px-2 py-6 transition-all ${
                            selectedAnswer === optionValue
                              ? 'bg-question-fill-selected'
                              : 'bg-question-fill-unselected'
                          }`}
                          data-cy-id={`quiz-button-full-single-select-${index}`}
                          data-testid={`quiz-button-full-single-select-${index}`}
                        >
                          <div className="flex w-full flex-col justify-start items-center gap-2">
                            {emoji && (
                              <span className="text-3xl">{emoji}</span>
                            )}
                            <span className="text flex-1 font-bold text-main text-base">
                              {optionValue}
                            </span>
                          </div>
                        </button>
                        )
                      })}
                    </div>
                  )}
                  </div>
                )}

                {/* Continue Button for Multi-Select Questions */}
                {steps[currentStep]?.allowMultiple && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleMultiSelectContinue}
                      disabled={selectedAnswers.length === 0}
                      className={`px-8 py-4 rounded-lg font-bold text-base transition-all ${
                        selectedAnswers.length > 0
                          ? 'bg-accent-main text-white cursor-pointer hover:opacity-90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      NEXT STEP
                    </button>
                  </div>
                )}

                {/* Background Image - For questions with background images (e.g., question 1, 6) */}
                {steps[currentStep]?.backgroundImage && (
                  <div className="fixed bottom-0 right-0 -z-20 h-[400px] w-full max-w-[400px] tablet:h-[500px] laptop:h-[600px] laptop:max-w-[580px]">
                    <div
                      className="-z-10 h-[400px] w-full bg-contain bg-right bg-no-repeat object-contain tablet:h-[500px] laptop:h-[600px]"
                      style={{
                        backgroundImage: `url("${steps[currentStep].backgroundImage}")`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

