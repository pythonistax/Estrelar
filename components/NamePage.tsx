'use client'

import { copy } from '@/lib/config'
import { useState } from 'react'

interface NamePageProps {
  onSubmit: (name: string) => void
  onBack?: () => void
}

export default function NamePage({ onSubmit, onBack }: NamePageProps) {
  const namePage = copy.namePage || {
    title: 'What is your name?',
    placeholder: 'Enter your name',
    cta: 'CONTINUE'
  }
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="fixed top-0 left-0 z-10 flex h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto flex w-full max-w-[400px] flex-col laptop:max-w-[1128px]">
          <div className="laptop:flex-grow" style={{ opacity: 1 }}>
            {/* Header */}
            <nav className="flex h-12 items-center justify-between border-b-2 border-secondary px-4 tablet:h-16">
              {/* Back Button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-main"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* Logo */}
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
            </nav>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 pb-[100px] laptop:h-full laptop:px-10">
              <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-6 laptop:flex-grow laptop:gap-8">
                {/* Title */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold leading-[30px] text-main laptop:text-3xl">
                    {namePage.title}
                  </h1>
                </div>

                {/* Name Input */}
                <div className="w-full max-w-[400px] laptop:max-w-[500px]">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePage.placeholder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-main placeholder:text-gray-400 focus:border-accent-main focus:outline-none"
                    required
                    autoFocus
                  />
                </div>

                {/* Submit Button */}
                <div className="w-full max-w-[400px] laptop:max-w-[500px]">
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`w-full rounded-lg p-4 text-base font-semibold uppercase transition-all ${
                      name.trim()
                        ? 'bg-accent-main text-white shadow-[0px_8px_24px_0px_rgba(86,83,254,0.3)] hover:opacity-90'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {namePage.cta}
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

