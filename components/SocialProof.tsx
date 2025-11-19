'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copy } from '@/lib/config'

interface Testimonial {
  name: string
  location: string
  text: string
  time: string
}

export default function SocialProof() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials: Testimonial[] = copy.socialProof.testimonials

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          {copy.socialProof.title}
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {copy.socialProof.stats.users}
            </div>
            <div className="text-sm text-gray-600 mt-1">Users</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {copy.socialProof.stats.satisfaction}
            </div>
            <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">
              {copy.socialProof.stats.completed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative bg-white rounded-xl shadow-lg p-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {testimonials[currentTestimonial].location}
                    </span>
                    <span className="text-xs text-gray-400">
                      {testimonials[currentTestimonial].time}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {testimonials[currentTestimonial].text}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTestimonial
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

