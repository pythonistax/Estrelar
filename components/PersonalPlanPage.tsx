'use client'

import { copy } from '@/lib/config'
import { motion } from 'framer-motion'

interface PersonalPlanPageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function PersonalPlanPage({ onContinue, onBack }: PersonalPlanPageProps) {
  const planPage = copy.personalPlanPage

  // Get the user's goal from quiz answers (question 18 answer, or default)
  const userGoal = planPage.goal

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="fixed top-0 left-0 z-10 flex h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto flex w-full max-w-[400px] flex-col laptop:max-w-[1128px]">
          <div className="laptop:flex-grow" style={{ opacity: 1 }}>
            {/* Header */}
            <nav className="flex h-12 items-center justify-between border-b-2 border-secondary px-4 tablet:h-16">
              {/* Logo */}
              <div className="flex items-center">
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

              {/* Hamburger Menu Icon */}
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent p-0"
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-[var(--text-main)]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </nav>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 pb-[100px] laptop:h-full laptop:px-10">
              <div className="flex flex-col items-center justify-center gap-6 laptop:flex-grow laptop:gap-8">
                {/* Title */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold leading-[30px] text-main laptop:text-3xl">
                    {planPage.title}
                  </h1>
                  <p className="text-base font-medium leading-6 text-secondary">
                    {planPage.subtitle}
                  </p>
                  <p className="text-xl font-bold leading-[30px] text-main underline laptop:text-2xl">
                    {planPage.aiConfidentDate}
                  </p>
                </div>

                {/* Your Goal Section */}
                <div className="w-full max-w-[400px] rounded-lg bg-question-fill-unselected px-4 py-3 laptop:max-w-[500px]">
                  <p className="text-base font-bold text-main">
                    Your goal: <span className="font-bold">{userGoal}</span>
                  </p>
                </div>

                {/* SVG Animation with Bars */}
                <div className="w-full max-w-[400px] laptop:max-w-[500px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      {/* Dashed lines for grid reference */}
                    </defs>
                    
                    {/* Horizontal dashed lines for reference (at 0%, 50%, 100%) */}
                    <line x1="30" y1="170" x2="370" y2="170" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="30" y1="100" x2="370" y2="100" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="30" y1="30" x2="370" y2="30" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
                    
                    {/* Y-Axis Labels */}
                    <text x="10" y="195" fontSize="12" fill="#6B7280" textAnchor="start" fontWeight="500">0</text>
                    <text x="10" y="105" fontSize="12" fill="#6B7280" textAnchor="start" fontWeight="500">50%</text>
                    <text x="10" y="15" fontSize="12" fill="#6B7280" textAnchor="start" fontWeight="500">100%</text>
                    
                    {/* Chart area - bars positioned dynamically from config */}
                    {planPage.chart.bars.map((bar, index) => {
                      const barWidth = 70;
                      const barSpacing = 90;
                      const barX = 40 + (index * barSpacing);
                      const baseY = 170; // Bottom line of chart
                      const barHeight = bar.height;
                      const barCenterX = barX + barWidth / 2;
                      
                      return (
                        <g key={bar.month}>
                          <motion.rect
                            x={barX}
                            width={barWidth}
                            fill={bar.fill}
                            rx="4"
                            initial={{ height: 0, y: baseY }}
                            animate={{ height: barHeight, y: baseY - barHeight }}
                            transition={{ duration: 0.8, delay: 0.2 + (index * 0.2), ease: "easeOut" }}
                          />
                          {bar.label && (
                            <motion.text
                              x={barCenterX}
                              y={baseY - barHeight - 5}
                              fontSize="10"
                              fill="#24234C"
                              textAnchor="middle"
                              fontWeight="600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.8 + (index * 0.2) }}
                            >
                              {bar.label}
                            </motion.text>
                          )}
                        </g>
                      );
                    })}
                    
                    {/* X-Axis Month Labels */}
                    {planPage.chart.xAxisLabels.map((label, index) => {
                      const barX = 40 + (index * 90) + 35; // Center of each bar
                      return (
                        <text key={index} x={barX} y="190" fontSize="14" fill="#6B7280" textAnchor="middle" fontWeight="500">
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Disclaimer */}
                <p className="text-xs font-normal leading-4 text-secondary">
                  {planPage.disclaimer}
                </p>
              </div>

              {/* CTA Button */}
              <div className="fixed bottom-0 left-0 mt-auto flex w-full items-center justify-center px-4 pt-8 pb-4 bg-white">
                <div className="w-full max-w-[400px]">
                  <button
                    onClick={onContinue}
                    className="relative w-full select-none p-4 transition-all bg-accent-main disabled:bg-accent-secondary rounded-lg shadow-[0px_8px_24px_0px_var(--shadow-accent-main)]"
                    data-cy-id="continue-quiz-button-personal-plan"
                    data-testid="continue-quiz-button-personal-plan"
                  >
                    <span className="text-base font-semibold uppercase text-white">{planPage.cta}</span>
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

