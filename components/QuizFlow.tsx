'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copy } from '@/lib/config'
import toast from 'react-hot-toast'

export default function QuizFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const steps = copy.quiz.steps

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: answer }))
    
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 300)
    } else {
      // Quiz completed
      toast.success('Quiz completed! Processing your results...')
      // Here you would typically redirect to results page or payment
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {steps[currentStep].question}
          </h2>

          <div className="space-y-4">
            {steps[currentStep].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="text-gray-700 font-medium">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>
    </div>
  )
}

