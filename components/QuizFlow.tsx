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
import SellingPage from './SellingPage'

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
  const [showSellingPage, setShowSellingPage] = useState(false)
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
    // After scratch page - show selling page (readiness level) - this is the final page
    setShowScratchPage(false)
    setShowSellingPage(true)
  }

  const handleSellingPageContinue = () => {
    // SellingPage (readiness level) is now the final page
    console.log('Quiz completed - readiness page is final')
    // You can add redirect or final action here if needed
  }

  const getOptionValue = (option: any): string => {
    return typeof option === 'string' ? option : option.text
  }

  const handleBackClick = () => {
    if (showSellingPage) {
      setShowSellingPage(false)
      setShowScratchPage(true)
      setSelectedAnswers([])
    } else if (showScratchPage) {
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
      // Go back to previous page based on context
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

  // Show selling page (readiness level) - FINAL PAGE
  if (showSellingPage) {
    return <SellingPage onContinue={handleSellingPageContinue} onBack={handleBackClick} sessionId={sessionId} />
  }

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

