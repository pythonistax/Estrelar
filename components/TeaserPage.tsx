'use client'

import { copy } from '@/lib/config'

interface TeaserPageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function TeaserPage({ onContinue, onBack }: TeaserPageProps) {
  const teaser = copy.teaser
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="fixed top-0 left-0 z-10 flex h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto flex w-full max-w-[400px] flex-col laptop:max-w-[1128px]">
          <div className="laptop:flex-grow" style={{ opacity: 1 }}>
            {/* Header */}
            <nav className="flex h-12 items-center justify-center border-b-2 border-secondary tablet:h-16">
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
            <div className="flex flex-col justify-between p-4 pb-[100px] laptop:h-full">
              <div className="items-center justify-center laptop:flex laptop:flex-grow laptop:flex-row-reverse laptop:gap-6 laptop:px-10 laptop:text-center">
                {/* Image */}
                <img
                  src={teaser.image}
                  className="mb-6 h-[224px] w-full object-cover laptop:h-full laptop:max-w-[500px] laptop:object-contain"
                  alt={teaser.title}
                />

                {/* Text Content */}
                <div className="flex flex-col gap-2 laptop:gap-4 laptop:px-14">
                  <h1 className="laptop:text-2xl text-xl font-bold leading-[30px] text-main">
                    {teaser.title}
                  </h1>
                  <p className="text-sm leading-5 text-secondary laptop:text-base">
                    {teaser.description}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="fixed bottom-0 left-0 mt-auto flex w-full items-center justify-center px-4 pt-8 pb-4">
                <div className="w-full max-w-[400px]">
                  <button
                    onClick={onContinue}
                    className="relative w-full select-none p-4 transition-all bg-accent-main disabled:bg-accent-secondary rounded-lg shadow-[0px_8px_24px_0px_var(--shadow-accent-main)]"
                    data-cy-id="continue-quiz-button-teaser"
                    data-testid="continue-quiz-button-teaser"
                  >
                    <span className="text-base font-semibold uppercase text-white">{teaser.cta}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

