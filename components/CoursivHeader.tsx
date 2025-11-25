'use client'

import { useState, useEffect } from 'react'

type DocumentType = 'terms' | 'privacy' | 'subscription' | 'moneyback' | null

export default function CoursivHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [documentOpen, setDocumentOpen] = useState<DocumentType>(null)
  const [documentContent, setDocumentContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load content when document type changes
    if (!documentOpen) {
      setDocumentContent('')
      return
    }

    setIsLoading(true)
    setDocumentContent('')

    const apiPath = {
      terms: '/api/legal-docs/terms',
      privacy: '/api/legal-docs/privacy',
      subscription: '/api/legal-docs/subscription',
      moneyback: '/api/legal-docs/moneyback',
    }[documentOpen]

    fetch(apiPath)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load document')
        return res.text()
      })
      .then(text => {
        setDocumentContent(text)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading document:', error)
        setDocumentContent('Error loading document. Please try again later.')
        setIsLoading(false)
      })
  }, [documentOpen])

  const handleDocumentClick = (type: DocumentType) => {
    setDocumentOpen(type)
    setMenuOpen(false)
  }

  const closeDocument = () => {
    setDocumentOpen(null)
    setDocumentContent('')
  }

  const formatDocumentContent = (content: string) => {
    if (!content) return null

    const lines = content.split('\n')
    const formattedLines: JSX.Element[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      const nextLine = lines[i + 1] || ''
      const prevLine = lines[i - 1] || ''
      
      // Skip empty lines but add minimal spacing
      if (trimmedLine === '') {
        formattedLines.push(<div key={i} className="h-1"></div>)
        continue
      }
      
      // Detect headers:
      // 1. Numbered sections (e.g., "1. Who We Are", "15.1. If you are...")
      const isNumberedHeader = /^\d+(\.\d+)*\.\s+[A-Z]/.test(trimmedLine)
      
      // 2. Lines that are all caps and short (like "TABLE OF CONTENTS", "PLEASE NOTE")
      const isAllCapsShort = trimmedLine.length > 0 && 
                            trimmedLine.length < 100 &&
                            trimmedLine === trimmedLine.toUpperCase() &&
                            /^[A-Z\s\.,:;!?'"-]+$/.test(trimmedLine) &&
                            trimmedLine.length > 2
      
      // 3. Short lines that are likely headers (followed by blank line, starts with capital)
      const isShortHeader = trimmedLine.length > 0 && 
                           trimmedLine.length < 80 && 
                           nextLine.trim() === '' && 
                           prevLine.trim() === '' &&
                           /^[A-Z]/.test(trimmedLine) && // Starts with uppercase
                           !trimmedLine.match(/^[a-z]/) // Doesn't start with lowercase
      
      // 4. Section headers (Title case, short, followed by blank)
      const isSectionHeader = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmedLine) && 
                             trimmedLine.length < 60 && 
                             nextLine.trim() === '' &&
                             !isNumberedHeader
      
      if (isNumberedHeader || isAllCapsShort || isShortHeader || isSectionHeader) {
        // Bold headers with slightly more spacing
        formattedLines.push(
          <div key={i} className="font-bold text-base mb-1 mt-3 first:mt-0">
            {line}
          </div>
        )
      } else {
        // Regular paragraph text with reduced spacing
        formattedLines.push(
          <div key={i} className="mb-1.5 text-sm leading-relaxed">
            {line}
          </div>
        )
      }
    }
    
    return formattedLines
  }

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
                <button
                  onClick={() => handleDocumentClick('terms')}
                  className="py-3 text-left text-gray-700 hover:text-gray-900"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={() => handleDocumentClick('privacy')}
                  className="py-3 text-left text-gray-700 hover:text-gray-900"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handleDocumentClick('subscription')}
                  className="py-3 text-left text-gray-700 hover:text-gray-900"
                >
                  Subscription Terms
                </button>
                <button
                  onClick={() => handleDocumentClick('moneyback')}
                  className="py-3 text-left text-gray-700 hover:text-gray-900"
                >
                  Money-back Guarantee
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Document Modal */}
      {documentOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeDocument}
          ></div>

          {/* Document Modal */}
          <div className="fixed inset-4 z-50 mx-auto max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {documentOpen === 'terms' && 'Terms & Conditions'}
                {documentOpen === 'privacy' && 'Privacy Policy'}
                {documentOpen === 'subscription' && 'Subscription Terms'}
                {documentOpen === 'moneyback' && 'Money-back Guarantee'}
              </h2>
              <button
                onClick={closeDocument}
                className="text-2xl font-bold text-gray-700 hover:text-gray-900"
                aria-label="Close document"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-none text-gray-800">
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="font-sans">
                    {formatDocumentContent(documentContent)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

