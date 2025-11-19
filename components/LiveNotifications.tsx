'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copy } from '@/lib/config'

export default function LiveNotifications() {
  const [notifications, setNotifications] = useState<string[]>([])
  const allNotifications = copy.notifications

  useEffect(() => {
    // Simulate live notifications appearing
    const interval = setInterval(() => {
      if (notifications.length < allNotifications.length) {
        setNotifications((prev) => [
          ...prev,
          allNotifications[notifications.length],
        ])
      } else {
        // Reset after showing all
        setNotifications([])
      }
    }, 8000) // New notification every 8 seconds

    return () => clearInterval(interval)
  }, [notifications.length, allNotifications])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
              <p className="text-sm text-gray-700">{notification}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

