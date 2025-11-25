'use client'

import { useState } from 'react'

export default function CoursivHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="relative z-10 flex h-12 w-full flex-row items-center justify-end border-b-2 border-gray-100 px-4">
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

        {/* Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 items-center justify-center"
          aria-label="Open menu"
        >
          <div className="space-y-1.5">
            <div className="h-0.5 w-6 bg-gray-700"></div>
            <div className="h-0.5 w-6 bg-gray-700"></div>
            <div className="h-0.5 w-6 bg-gray-700"></div>
          </div>
        </button>
      </header>

      {/* Menu Popup */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Menu */}
          <div className="fixed right-0 top-0 z-50 h-full w-64 bg-white shadow-lg">
            <div className="flex h-full flex-col">
              {/* Close Button */}
              <div className="flex items-center justify-end p-4">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-gray-700"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-1 flex-col px-4">
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  Terms & Conditions
                </a>
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  Privacy Policy
                </a>
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  Subscription Terms
                </a>
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  Money Back
                </a>
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  Support Center
                </a>
                <a href="#" className="py-3 text-left text-gray-700 hover:text-gray-900">
                  e-Privacy Settings
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}

