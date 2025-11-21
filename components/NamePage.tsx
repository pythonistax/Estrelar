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
                <svg xmlns="http://www.w3.org/2000/svg" width="99" height="30">
                  <path fill="var(--text-accent, #5653FE)" d="M20.233 21.254c-2.068 0-3.822-1.225-4.541-3.17-.764-2.027-.495-4.858.674-7.816.45-1.057.945-2.028 1.529-2.916 2.113 1.057 4.406 1.902 6.97 1.902 3.012 0 6.025-1.48 6.069-4.733C30.979 2.24 28.596 0 25.224 0c-2.878 0-5.755 1.268-8.048 3.507C14.208 1.817 11.016 0 7.464 0 3.642 0 0 2.62 0 6.507c0 3.043 2.473 5.62 5.8 5.62 2.968 0 5.396-2.113 5.396-4.944 0-1.14-.764-2.282-1.664-2.789L7.644 6.296c.27.254.405.718.405 1.014 0 1.014-1.125 1.86-2.339 1.86-1.484 0-2.562-1.184-2.562-2.663 0-2.24 2.247-3.55 4.316-3.55 2.652 0 5.126 1.437 7.733 2.916a17.74 17.74 0 0 0-2.023 3.972c-1.484 4.099-1.439 7.564-.09 10.141 1.574 3 4.631 4.015 7.014 4.015 3.867 0 8.004-2.24 10.162-7.31l-2.608-.592c-.944 2.493-3.867 5.155-7.419 5.155Zm4.811-18.508c1.979 0 2.923.972 2.923 1.86 0 1.098-1.26 1.859-3.058 1.859-1.663 0-3.282-.634-4.99-1.48 1.573-1.436 3.416-2.239 5.125-2.239Z"></path>
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

