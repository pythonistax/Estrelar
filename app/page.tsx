'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SocialProof from '@/components/SocialProof'
import LiveNotifications from '@/components/LiveNotifications'
import CountdownTimer from '@/components/CountdownTimer'
import QuizFlow from '@/components/QuizFlow'
import { copy } from '@/lib/config'

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              {copy.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 opacity-90"
            >
              {copy.hero.subtitle}
            </motion.p>
            {!showQuiz && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setShowQuiz(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {copy.hero.cta}
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      {!showQuiz && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <CountdownTimer hours={23} minutes={45} seconds={30} />
        </section>
      )}

      {/* Quiz Section */}
      {showQuiz ? (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <QuizFlow />
        </section>
      ) : (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="font-semibold mb-2">Answer Questions</h3>
                <p className="text-gray-600 text-sm">
                  Quick and easy questions about your preferences
                </p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="font-semibold mb-2">Get Matched</h3>
                <p className="text-gray-600 text-sm">
                  Our algorithm finds your perfect match
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="font-semibold mb-2">See Results</h3>
                <p className="text-gray-600 text-sm">
                  Discover what's right for you
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      {!showQuiz && <SocialProof />}

      {/* Live Notifications */}
      <LiveNotifications />
    </main>
  )
}

