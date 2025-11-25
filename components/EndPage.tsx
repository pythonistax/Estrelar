'use client'

import { copy } from '@/lib/config'

interface EndPageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function EndPage({ onContinue, onBack }: EndPageProps) {
  const endPage = copy.endPage

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="relative z-10 mx-auto flex h-full min-h-full w-full max-w-[400px] flex-col tablet:max-w-full pb-[104px] gap-6">
        {/* Header */}
        <div className="h-12 tablet:h-16">
          <div className="relative flex h-full items-center justify-center border-b border-gray-200">
            {/* Back Button */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="absolute left-4 top-[50%] -translate-y-1/2 cursor-pointer border-0 bg-transparent fill-accent-secondary p-0"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="fill-[var(--text-main)]">
                  <path d="M11.707 5.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0Z"></path>
                </svg>
              </button>
            )}

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
          </div>
        </div>

        {/* Main Content - 50/50 Split Layout */}
        <div className="flex flex-1 flex-col laptop:flex-row laptop:items-center laptop:justify-center laptop:gap-8 laptop:px-8">
          {/* Left Half - Text Content */}
          <div className="flex flex-1 flex-col items-center justify-center laptop:h-full laptop:w-1/2 laptop:items-start laptop:px-8">
            <div className="flex flex-col items-start gap-4 px-4 laptop:px-0">
              <h1 className="text-2xl font-bold leading-9 text-main laptop:text-3xl">
                {endPage.title}
              </h1>
              <p className="text-base font-medium leading-6 text-secondary laptop:text-lg laptop:leading-7">
                {endPage.description}
              </p>
            </div>
          </div>

          {/* Right Half - Image */}
          <div className="flex flex-1 items-center justify-center laptop:h-full laptop:w-1/2">
            <div
              className="bg-contain bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: `url("${endPage.image}")`,
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                maxWidth: '500px',
                height: '400px',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mx-auto w-full max-w-[400px] fixed bottom-0 left-0 right-0 z-10 laptop:static laptop:mt-0 laptop:mb-0 laptop:flex-shrink-0">
          <div className="flex flex-col px-4 py-2 bg-transparent laptop:px-0 laptop:pt-0 laptop:pb-0">
            <button
              onClick={onContinue}
              className="relative w-full select-none p-4 transition-all rounded-lg laptop:w-[368px] laptop:mx-auto"
              style={{
                backgroundColor: '#5653FE',
                borderRadius: '8px',
              }}
            >
              <span className="text-base font-semibold uppercase" style={{ color: '#FFFFFF' }}>
                {endPage.cta}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

