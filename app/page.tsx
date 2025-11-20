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
        <div className="mx-auto flex h-full max-w-[400px] flex-col items-center justify-center px-4 tablet:max-w-[580px] laptop:max-w-[1100px]">
          {/* Article Container - Text and Image Side by Side */}
          <article className="w-full space-y-4 pt-6 laptop:flex laptop:flex-grow laptop:flex-row laptop:items-center laptop:space-y-0">
            {/* Text Container - LEFT ALIGNED */}
            <div className="flex flex-1 flex-col items-start justify-start space-y-1 laptop:pr-8">
              {/* Main Heading */}
              <h1 
                className="text-left text-[28px] font-extrabold leading-[42px]" 
                style={{ color: '#5653FE' }}
              >
                More than 700,000
              </h1>

              {/* Secondary Text */}
              <p 
                className="text-left text-lg font-medium leading-[28px]" 
                style={{ color: '#24234C' }}
              >
                people joined Coursiv to master AI
              </p>
            </div>

            {/* Image Container - MUST BE VISIBLE */}
            <div 
              className="w-full flex-1 bg-contain bg-center bg-no-repeat laptop:max-w-[500px]"
              style={{
                height: '330px',
                minHeight: '330px',
                backgroundImage: 'url("https://d3kigabz1zn79w.cloudfront.net/male-1.webp")',
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                marginTop: '16px',
                display: 'block',
              }}
            />
          </article>

          {/* CTA Button Container */}
          <div className="mx-auto w-full max-w-[400px] fixed bottom-0 left-0 right-0 z-10 laptop:static">
            <div className="flex flex-col px-4 py-6 bg-transparent laptop:px-0 laptop:mt-[77px]">
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

