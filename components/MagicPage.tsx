'use client'

import { copy } from '@/lib/config'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MagicPageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function MagicPage({ onContinue, onBack }: MagicPageProps) {
  const magicPage = copy.magicPage
  const [progress, setProgress] = useState(0)
  const [reviewIndex, setReviewIndex] = useState(0)
  const reviews = magicPage.reviews

  // Animate progress from 0 to 100%
  useEffect(() => {
    const duration = 4000 // 4 seconds for a smoother animation
    const targetProgress = 100 // Always animate to 100%
    const increment = targetProgress / (duration / 16) // 60fps
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetProgress) {
          clearInterval(timer)
          return targetProgress
        }
        return Math.min(prev + increment, targetProgress)
      })
    }, 16)

    return () => clearInterval(timer)
  }, [])

  // Auto-advance ONLY when progress reaches exactly 100%
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onContinue()
      }, 1000) // Wait 1 second after reaching 100%
      return () => clearTimeout(timer)
    }
  }, [progress, onContinue])

  // Calculate the circumference for the circular progress
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  // Rotate reviews dynamically - alternating sides
  const [prevReviewIndex, setPrevReviewIndex] = useState(-1)
  const [slideFromRight, setSlideFromRight] = useState(true) // Track which side to slide from

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevReviewIndex(reviewIndex)
      // Alternate sides dynamically
      setSlideFromRight((prev) => !prev)
      setReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 3500) // Change review every 3.5 seconds
    return () => clearInterval(interval)
  }, [reviewIndex, reviews.length])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="relative z-10 mx-auto flex h-full min-h-full w-full max-w-[400px] flex-col tablet:max-w-full">
        <div className="">
          {/* Header */}
          <div className="relative flex h-12 w-full flex-row items-center justify-end border-b-2 border-secondary px-4 py-2 tablet:h-16">
            <div className="absolute left-1/2 -translate-x-1/2">
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
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="cursor-pointer text-fill-accent-secondary transition-all duration-300 active:scale-75">
              <path fill="currentColor" d="M2 5.333C2 4.597 2.56 4 3.25 4h17.5c.69 0 1.25.597 1.25 1.333 0 .737-.56 1.334-1.25 1.334H3.25C2.56 6.667 2 6.07 2 5.333ZM2 12c0-.736.56-1.333 1.25-1.333h17.5c.69 0 1.25.597 1.25 1.333s-.56 1.333-1.25 1.333H3.25C2.56 13.333 2 12.736 2 12Zm0 6.667c0-.737.56-1.334 1.25-1.334h17.5c.69 0 1.25.597 1.25 1.334 0 .736-.56 1.333-1.25 1.333H3.25C2.56 20 2 19.403 2 18.667Z"></path>
            </svg>
          </div>

          {/* Main Content */}
          <div className="h-full w-full">
            <div className="mx-auto flex max-w-[400px] flex-col items-center px-6 tablet:max-w-[580px]">
              <div className="w-full">
                {/* Loading Section */}
                <div className="my-8 flex h-full flex-col items-center justify-between gap-4 px-4">
                  {/* Circular Progress */}
                  <div className="relative">
                    <svg width="128" height="128" viewBox="0 0 128 128" className="relative">
                      {/* Background circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="var(--bg-secondary)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="var(--fill-main)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 64 64)"
                        className="transition-all duration-300 ease-out"
                      />
                      {/* Progress text */}
                      <text
                        x="64"
                        y="64"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="30"
                        fontWeight="bold"
                        fill="var(--text-main)"
                        className="font-bold"
                      >
                        {Math.round(progress)}%
                      </text>
                    </svg>
                  </div>
                  <p className="text-center text-main">{magicPage.title}</p>
                </div>

                {/* Separator */}
                <div className="h-[1px] w-full bg-secondary"></div>

                {/* Social Proof */}
                <div className="my-8 text-center">
                  <p className="text-[32px] font-extrabold text-accent-main">
                    {magicPage.socialProof.title}
                  </p>
                  <p className="text-[20px] font-bold text-main">
                    {magicPage.socialProof.subtitle}
                  </p>
                </div>

                {/* Review Carousel */}
                <div>
                  <div className="relative min-h-[200px] w-full overflow-hidden rounded-lg md:min-h-[192px]">
                    {reviews.map((review, index) => {
                      const isActive = index === reviewIndex
                      const isPrevious = index === prevReviewIndex && prevReviewIndex !== -1
                      
                      // Determine slide direction: alternate dynamically
                      // The incoming review slides from the side determined by slideFromRight
                      // The outgoing review slides to the opposite side
                      const slideInFrom = slideFromRight ? '100%' : '-100%'
                      const slideOutTo = slideFromRight ? '-100%' : '100%'
                      
                      // Calculate position based on state
                      let xPosition: string
                      let opacity: number
                      let zIndex: number
                      
                      if (isActive) {
                        // Active review: centered
                        xPosition = '0%'
                        opacity = 1
                        zIndex = 10
                      } else if (isPrevious) {
                        // Previous review: sliding out to opposite side
                        xPosition = slideOutTo
                        opacity = 0
                        zIndex = 5
                      } else {
                        // Other reviews: positioned off-screen on entry side
                        xPosition = slideInFrom
                        opacity = 0
                        zIndex = 1
                      }
                      
                      return (
                        <motion.div
                          key={index}
                          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-magic-page p-4 drop-shadow-[0_0_12px_rgba(0,0,0,0.12)]"
                          animate={{
                            x: xPosition,
                            opacity: opacity,
                            scale: isActive ? 1 : 0.95,
                            zIndex: zIndex
                          }}
                          transition={{ 
                            duration: 0.7, 
                            ease: [0.4, 0, 0.2, 1],
                            opacity: { duration: 0.5 }
                          }}
                        >
                        {/* Stars */}
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="relative h-5 w-5 flex-none bg-[#219653]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="none" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <path fill="#fff" d="m8 12.136 3.422-.917 1.43 4.656L8 12.135Zm7.875-6.018H9.852L8 .125 6.148 6.118H.125L5 9.833l-1.852 5.992 4.875-3.714 3-2.278 4.852-3.715Z"></path>
                              </svg>
                            </div>
                          ))}
                          {/* Half star */}
                          <div className="relative h-5 w-5 flex-none">
                            <div className="h-full w-full bg-[#c5c4c4]"></div>
                            <div className="absolute top-0 left-0 h-full w-1/2 bg-[#219653]"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="none" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <path fill="#fff" d="m8 12.136 3.422-.917 1.43 4.656L8 12.135Zm7.875-6.018H9.852L8 .125 6.148 6.118H.125L5 9.833l-1.852 5.992 4.875-3.714 3-2.278 4.852-3.715Z"></path>
                            </svg>
                          </div>
                        </div>

                        {/* Review Header */}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-main">{review.tag}</span>
                          <span className="text-sm text-secondary">{review.name}</span>
                        </div>

                        {/* Review Text */}
                        <div className="mt-2 text-sm font-normal leading-[21px] text-secondary">
                          {review.review}
                        </div>
                      </motion.div>
                      )
                    })}
                  </div>

                  {/* Review Source */}
                  <div className="mx-auto w-full max-w-[400px]">
                    <p className="py-3 text-center text-sm text-secondary">
                      {magicPage.reviewsSource}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

