'use client'

import { useState } from 'react'
import CoursivHeader from '@/components/CoursivHeader'

export default function CoursivPage() {
  const [showQuiz, setShowQuiz] = useState(false)

  return (
    <div id="classic-social-proof" className="laptop:h-full">
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Header */}
        <CoursivHeader />

        {/* Main Content Container */}
        <div className="relative z-10 mx-auto flex h-full min-h-full w-full max-w-[400px] flex-col tablet:max-w-full">
          {/* Content Wrapper */}
          <div className="h-full w-full">
            <div className="mx-auto flex h-full max-w-[400px] flex-col items-center justify-center px-4 tablet:max-w-[580px] laptop:max-w-[1100px] laptop:flex-row laptop:items-center laptop:justify-center">
              {/* Left Side - Text Content */}
              <article className="w-full space-y-4 pt-6 laptop:flex laptop:flex-grow laptop:flex-row laptop:items-center">
                <div className="flex flex-1 flex-col items-center justify-center space-y-1">
                  <div className="flex flex-col px-4 py-6 bg-transparent">
                    {/* Main Heading */}
                    <h2
                      className="text-center"
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#5653FE',
                        lineHeight: '1.2',
                        marginBottom: '4px',
                      }}
                    >
                      More than 700,000
                    </h2>

                    {/* Secondary Text */}
                    <p
                      className="text-center"
                      style={{
                        color: '#24234C',
                        fontSize: '16px',
                        lineHeight: '1.5',
                      }}
                    >
                      people joined Coursiv to master AI
                    </p>
                  </div>
                </div>
              </article>

              {/* Right Side - Image */}
              <div className="w-full laptop:w-1/2 laptop:flex laptop:items-center laptop:justify-center">
                <div className="relative mx-auto max-w-md w-full">
                  {/* Image Placeholder - Replace with actual founder image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Founder Image Placeholder</p>
                    </div>
                    {/* Annotation Bubble */}
                    <div className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 shadow-lg">
                      <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-white"></div>
                      <p className="text-sm font-medium text-gray-800">Founder of Coursiv</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Fixed Bottom on Mobile */}
          <div className="mx-auto w-full max-w-[400px] fixed bottom-0 left-0 right-0 z-10 bg-white px-4 py-6 laptop:static laptop:max-w-[1100px] laptop:px-0">
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full rounded-lg font-semibold transition-all hover:opacity-90 laptop:w-[368px] laptop:mx-auto"
              style={{
                backgroundColor: '#5653FE',
                color: '#000000',
                height: '56px',
                maxWidth: '100%',
                display: 'block',
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

