'use client'

import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ScratchCardProps {
  onComplete: () => void
}

export default function ScratchCard({ onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw orange scratch overlay
    ctx.fillStyle = '#FF6B35'
    ctx.fillRect(0, 0, 230, 230)

    // Add "Scratch here" text
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Scratch here', 115, 115)
  }, [])

  const getFilledPercentage = () => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext('2d')
    if (!ctx) return 0

    const imageData = ctx.getImageData(0, 0, 230, 230)
    const pixels = imageData.data
    let transparent = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparent++
      }
    }

    return (transparent / (pixels.length / 4)) * 100
  }

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const posX = (x - rect.left) * scaleX
    const posY = (y - rect.top) * scaleY

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(posX, posY, 20, 0, Math.PI * 2)
    ctx.fill()

    const percentage = getFilledPercentage()
    setScratchPercentage(percentage)

    if (percentage > 50 && !showModal) {
      setShowConfetti(true)

      // Trigger confetti animation
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#FF6B9D', '#C0FFEB', '#FFF568', '#5653FE', '#FFD93D']

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()

      setTimeout(() => {
        setShowModal(true)
      }, 100)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    scratch(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsScratching(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    const touch = e.touches[0]
    scratch(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      const touch = e.touches[0]
      scratch(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    setIsScratching(false)
  }

  return (
    <>

      {/* Scratch Card Section */}
      <div className="space-y-2 mb-12 pt-4">
        <h1 className="mx-auto max-w-[500px] text-center text-2xl font-bold text-main laptop:text-3xl">
          Scratch & Save on your{' '}
          <span className="text-accent-main">28-Day AI Challenge!</span>
        </h1>
        <p className="text-center text-base font-normal text-main">
          Boost your skills and master AI!
          <br />
          Get your gift with us 🎁
        </p>
      </div>

      <p className="mb-3 text-center text-sm text-secondary">Scratch the card👇🏻</p>

      {/* Scratch Card Container */}
      <div className="relative flex justify-center mb-8">
        <div className="relative">
          <div className="relative" style={{ width: '230px' }}>
            <div className="relative" style={{ width: '230px', height: '230px' }}>
              {/* Canvas for Scratching */}
              <canvas
                ref={canvasRef}
                width={230}
                height={230}
                className="absolute top-0 left-0 cursor-pointer rounded-3xl"
                style={{
                  zIndex: 1,
                  transition: 'opacity 1s',
                  opacity: scratchPercentage > 50 ? 0 : 1,
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />

              {/* Result (Green 50% OFF Box) */}
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ visibility: 'visible' }}
              >
                <div className="aspect-square w-[230px] max-w-[230px] overflow-hidden rounded-3xl text-main bg-[#EBF5E4]">
                  {/* 50% OFF Text */}
                  <div className="flex h-[50%] items-end justify-center pb-6" style={{ color: '#4F981D' }}>
                    <div className="text-[64px] font-semibold leading-[100%]">50</div>
                    <div className="text-[28px] leading-[100%]">
                      %<div>OFF</div>
                    </div>
                  </div>

                  {/* Dotted Line Divider with Circles */}
                  <div className="relative">
                    <div className="absolute left-[-16px] top-[-16px] h-[32px] w-[32px] min-w-[32px] rounded-full bg-main"></div>
                    <div className="border-b border-dashed" style={{ borderColor: '#9CC77E' }}></div>
                    <div className="absolute right-[-16px] top-[-16px] h-[32px] w-[32px] min-w-[32px] rounded-full bg-main"></div>
                  </div>

                  {/* Promo Code */}
                  <div className="px-4 pb-10 pt-6">
                    <p className="text-center text-base text-main">sss_nov2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Woo hoo! Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1300]" />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[1301] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Party Emoji */}
              <div className="flex justify-center mb-4">
                <span className="text-6xl">🥳</span>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#24234C' }}>
                Woo hoo!
              </h2>

              {/* Subtitle */}
              <p className="text-center text-lg mb-2" style={{ color: '#6B7280' }}>
                You won a promo code with
              </p>

              {/* 50% off */}
              <p className="text-center text-5xl font-bold mb-4" style={{ color: '#5653FE' }}>
                50% off
              </p>

              {/* Description */}
              <p className="text-center text-base mb-6" style={{ color: '#6B7280' }}>
                It will be applied automatically
              </p>

              {/* Button */}
              <button
                onClick={() => {
                  setShowModal(false)
                  onComplete()
                }}
                className="w-full bg-accent-main text-white font-bold py-4 rounded-lg uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                CLAIM MY DISCOUNT
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
