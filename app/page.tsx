'use client'

import { useState } from 'react'
import CoursivHeader from '@/components/CoursivHeader'

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false)

  return (
    <div id="classic-social-proof" className="min-h-screen bg-white">
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Header */}
        <CoursivHeader />

        {/* Main Content Container */}
        <div className="mx-auto flex h-full max-w-[400px] flex-col px-4 tablet:max-w-[580px] laptop:max-w-[1100px] laptop:h-screen laptop:flex-col laptop:justify-start laptop:pt-2 laptop:pb-0">
          {/* Article Container - Split 50/50 */}
          <article className="w-full laptop:flex laptop:flex-row laptop:space-y-0 laptop:items-center laptop:mb-2">
            {/* Left Half - Text Container - Perfectly centered in left half */}
            <div className="flex flex-1 flex-col items-center justify-center laptop:h-full laptop:w-1/2">
              <div className="flex flex-col items-start">
                {/* Main Heading */}
                <h1 
                  className="text-left text-[28px] font-extrabold" 
                  style={{ 
                    color: '#5653FE',
                    lineHeight: '42px',
                  }}
                >
                  "More than 700,000"
                </h1>

                {/* Secondary Text */}
                <p 
                  className="text-left text-lg font-medium" 
                  style={{ 
                    color: '#24234C',
                    lineHeight: '28px',
                  }}
                >
                  people joined Coursiv to master AI
                </p>
              </div>
            </div>

            {/* Right Half - Image Container - Perfectly centered in right half */}
            <div className="flex flex-1 items-center justify-center laptop:h-full laptop:w-1/2">
              <div 
                className="bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://d3kigabz1zn79w.cloudfront.net/male-1.webp")',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  width: '700px',
                  height: '420px',
                  display: 'block',
                  position: 'static',
                }}
              />
            </div>
          </article>

          {/* CTA Button Container - Directly below image section */}
          <div className="mx-auto w-full max-w-[400px] fixed bottom-0 left-0 right-0 z-10 laptop:static laptop:mt-0 laptop:mb-0">
            <div className="flex flex-col px-4 py-2 bg-transparent laptop:px-0 laptop:pt-0 laptop:pb-0">
              <button
                onClick={() => setShowQuiz(true)}
                className="relative w-full select-none p-4 transition-all rounded-lg laptop:w-[368px] laptop:mx-auto"
                style={{
                  backgroundColor: '#5653FE',
                  borderRadius: '8px',
                }}
                data-cy-id="social-proof-button"
                data-testid="social-proof-button"
              >
                <span className="text-base font-semibold uppercase" style={{ color: '#FFFFFF' }}>
                  CONTINUE
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

