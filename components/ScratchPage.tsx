'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copy } from '@/lib/config'

interface ScratchPageProps {
  onComplete: () => void
  onBack?: () => void
}

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  velocityX: number
  velocityY: number
  size: number
}

export default function ScratchPage({ onComplete, onBack }: ScratchPageProps) {
  const scratchPage = copy.scratchPage || {
    title: 'Scratch & Save on your',
    titleAccent: '28-Day AI Challenge!',
    subtitle: "Boost your skills and master AI!\nGet your gift with us 🎁",
    scratchPrompt: 'Scratch the card👇🏻',
    discountValue: '50',
    discountUnit: '% OFF',
    promoCode: 'sss_nov2025',
    cta: 'CLAIM MY DISCOUNT'
  }

  const [isRevealed, setIsRevealed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const [revealedPercent, setRevealedPercent] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScratching = useRef(false)
  const [cardSize] = useState(360) // Fixed square size
  const animationFrameRef = useRef<number | null>(null)

  // Create confetti particles
  const createConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']
    const particles: ConfettiParticle[] = []
    
    // Get card position
    const cardRect = containerRef.current?.getBoundingClientRect()
    const centerX = cardRect ? cardRect.left + cardRect.width / 2 : window.innerWidth / 2
    const centerY = cardRect ? cardRect.top + cardRect.height / 2 : window.innerHeight / 2

    for (let i = 0; i < 60; i++) {
      particles.push({
        id: i,
        x: centerX,
        y: centerY,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 12,
        velocityY: (Math.random() - 0.5) * 12 - 8,
        size: Math.random() * 10 + 5
      })
    }
    setConfetti(particles)
    
    // Show modal after confetti animation completes
    setTimeout(() => {
      setShowModal(true)
    }, 2000) // Show modal after 2 seconds
  }

  // Animate confetti
  useEffect(() => {
    if (confetti.length === 0) return

    let animationId: number
    const startTime = Date.now()
    const duration = 2000 // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress >= 1) {
        // Animation complete, clean up confetti
        setConfetti([])
        return
      }

      setConfetti((prev) => {
        if (prev.length === 0) return prev

        const updated = prev.map((particle) => {
          // Calculate new position with gravity
          const newX = particle.x + particle.velocityX * 0.15
          const newY = particle.y + particle.velocityY * 0.15 + 0.5 // Gravity
          const newRotation = particle.rotation + particle.velocityX * 0.3
          const newVelocityY = particle.velocityY + 0.3 // Gravity effect

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation,
            velocityY: newVelocityY
          }
        })

        // Remove particles that are off-screen
        return updated.filter((p) => 
          p.y < window.innerHeight + 200 && 
          p.x > -200 && 
          p.x < window.innerWidth + 200
        )
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [confetti.length])

  // Scratch card canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !containerRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = cardSize
    canvas.height = cardSize

    // Create yellow-orange gradient background for scratch layer (matching the image)
    const gradient = ctx.createLinearGradient(0, 0, cardSize, cardSize)
    gradient.addColorStop(0, '#FFE4B5') // Light warm yellow-orange (top)
    gradient.addColorStop(1, '#FFD89B') // Deeper orange-yellow (bottom)

    // Fill with gradient
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add squiggly wavy line pattern overlay (matching the image - one continuous wavy line)
    ctx.globalAlpha = 0.4
    ctx.strokeStyle = '#FFFEF0' // Very light pale yellow
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Draw one continuous wavy/squiggly line from top-left to bottom-right
    ctx.beginPath()
    let startX = 30
    let startY = 40
    ctx.moveTo(startX, startY)
    
    // Create smooth wavy path
    const points = 15
    for (let i = 1; i <= points; i++) {
      const t = i / points
      const x = startX + (cardSize - 60) * t + Math.sin(t * Math.PI * 3) * 30
      const y = startY + (cardSize - 80) * t + Math.cos(t * Math.PI * 4) * 25
      ctx.lineTo(x, y)
    }
    ctx.stroke()
    
    // Add a few additional lighter squiggly lines for texture
    ctx.globalAlpha = 0.25
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      let x = 20 + Math.random() * 40
      let y = 30 + Math.random() * 40
      ctx.moveTo(x, y)
      for (let j = 0; j < 8; j++) {
        x += 30 + Math.random() * 40
        y += 30 + Math.random() * 40
        if (x > cardSize - 20) x = cardSize - 20
        if (y > cardSize - 20) y = cardSize - 20
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    ctx.globalAlpha = 1.0

    // Simple touch/click to trigger reveal
    const handleCardClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      if (isRevealed) return // Don't trigger again if already revealed
      
      setIsRevealed(true)
      // Start smooth reveal animation
      animateFullReveal(ctx)
      // Trigger confetti after reveal completes
      setTimeout(() => {
        createConfetti()
      }, 1000) // Wait 1 second for reveal animation to complete
    }

    // Animate smooth reveal of the entire card
    const animateFullReveal = (ctx: CanvasRenderingContext2D) => {
      let animationId: number | null = null
      const duration = 1000 // 1 second for smooth reveal
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Use a smooth easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        // Create a radial reveal from center, expanding outward
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        
        // Clear in expanding circles
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY)
        const currentRadius = maxRadius * easeOut
        
        // Create a circular reveal mask
        ctx.beginPath()
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        } else {
          // Fully clear the canvas when done
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      
      animationId = requestAnimationFrame(animate)
      
      // Store animation ID for cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = animationId
    }

    // Simple click/touch to trigger reveal
    canvas.addEventListener('click', handleCardClick)
    canvas.addEventListener('touchstart', handleCardClick, { passive: false })

    return () => {
      canvas.removeEventListener('click', handleCardClick)
      canvas.removeEventListener('touchstart', handleCardClick)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [cardSize, isRevealed])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Confetti particles */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'opacity 0.3s ease-out',
            opacity: 1,
          }}
        />
      ))}

      <div className="fixed top-0 left-0 z-10 flex h-full w-full overflow-y-auto bg-white">
        <div className="mx-auto flex w-full max-w-[400px] flex-col laptop:max-w-[1128px]">
          <div className="laptop:flex-grow" style={{ opacity: 1 }}>
            {/* Header */}
            <nav className="flex h-12 items-center justify-center border-b-2 border-secondary px-4 tablet:h-16">
              {/* Back Button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="absolute left-4 flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                  <path fill="url(#logo_svg__a)" d="M17.174 3.507C14.207 1.817 11.014 0 7.462 0v2.958c2.653 0 5.126 1.436 7.734 2.915.611-.854 1.3-1.649 1.978-2.366Z" opacity="0.51"></path>
                  <path fill="url(#logo_svg__b)" d="M27.967 4.606c0 1.098-1.259 1.859-3.057 1.859-1.664 0-3.283-.634-4.991-1.48-.696.656-1.357 1.421-2.024 2.368 2.114 1.056 4.407 1.901 6.97 1.901 3.012 0 6.025-1.48 6.07-4.733l-2.968.085Z" opacity="0.51"></path>
                  <path fill="var(--text-accent, #5653FE)" d="M41.19 16.098c-.45 1.48-1.439 2.029-2.338 2.029-.135 0-.225 0-.36-.043 1.259-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169-3.057 0-5.665 2.155-6.879 5.832-1.349 4.183-.045 7.436 3.058 8.24.404.084.809.126 1.214.126 1.978 0 4.091-1.141 5.53-3.38.405.126.854.168 1.484.168 1.664 0 3.911-.718 5.036-4.098l-2.654-.592Zm-5.126-.084c-1.214.295-1.978 2.366-1.169 3.127-.99 1.52-2.293 2.324-3.327 2.155-1.574-.296-2.248-2.198-1.17-5.113.945-2.535 2.969-4.099 4.452-3.592.99.338 1.529 1.564 1.214 3.423Z"></path>
                  <path fill="url(#logo_svg__c)" d="M34.85 12.591c.99.338 1.529 1.564 1.214 3.423-.026.835.947 1.81 2.428 2.07 1.26-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169l.45 2.79Z" opacity="0.51"></path>
                  <path fill="url(#logo_svg__d)" d="M34.896 19.14c-.99 1.522-2.294 2.325-3.328 2.156l-.989 2.577c.405.084.81.127 1.214.127 1.978 0 4.092-1.141 5.53-3.38-1.237-.312-2.108-1.02-2.427-1.48Z" opacity="0.51"></path>
                  <path fill="var(--text-accent, #5653FE)" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.113-7.31h3.013L43.6 17.83c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.676 3.237-6.212l.81-2.789h3.012l-2.518 8.832c-.36 1.225-.54 2.24.045 2.45.81.296 2.473-1.52 3.822-5.324l2.652.592C56.415 20.873 54.481 24 51.244 24c-1.618 0-2.832-1.31-2.967-2.747Z"></path>
                  <path fill="url(#logo_svg__e)" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.922.38c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.677 3.237-6.212-.58 2.112-2.084 6.205-1.843 8.324Z" opacity="0.51"></path>
                  <path fill="var(--text-accent, #5653FE)" d="M57.832 20.493c.18-3.043 2.742-5.07 3.687-7.141l-2.608-.803c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647-.584-.465-.944-1.775.045-2.494.81-.59 2.069-.295 2.653.55.809.338 2.563.803 4.316 1.352.944.296 1.709.507 1.979 1.14.27.635-.405 1.564-1.844 3.508-1.034 1.394-2.698 3.465-2.652 4.732 0 .592.404.93.944.93 1.123 0 3.192-1.352 4.63-5.282l2.654.592C67.228 21.507 64.71 24 61.564 24c-2.158 0-3.867-1.521-3.732-3.507Z"></path>
                  <path fill="url(#logo_svg__f)" d="M58.911 12.549c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647.457.369 1.782.607 2.608.887Z" opacity="0.51"></path>
                  <path fill="url(#logo_svg__g)" d="M57.831 20.493c.18-3.043 2.743-5.07 3.687-7.141 1.286.377 2.693.969 2.765 1.23-.24.336-.517.712-.831 1.136-1.035 1.394-2.698 3.465-2.653 4.732l-2.968.043Z" opacity="0.51"></path>
                  <path fill="var(--text-accent, #5653FE)" d="m77.755 16.69-2.653-.592c-.584 1.648-1.664 2.831-3.147 3.803-1.799-3.084-3.912-4.986-3.418-6.422.27-.888 1.215-1.226 1.98-.972.674.211.898.93.898 1.14l2.248-.802c-.045-.465-.27-1.141-.674-1.69-.675-.888-1.798-1.353-3.012-1.353-2.204 0-3.688 1.226-4.182 3-.9 3.296 2.203 5.79 3.732 8.41-.72.337-1.53.675-2.338 1.013-3.957 1.648-4.856 3.465-4.496 5.07.36 1.522 1.933 2.705 4.091 2.705 3.732 0 7.149-3.38 6.205-7.606 1.798-1.183 3.687-2.62 4.766-5.704ZM67.234 27.38c-.9.17-1.574-.042-1.664-.507-.09-.38.09-1.014 1.844-1.859.989-.465 1.933-.845 2.877-1.226-.045 2.198-2.113 3.423-3.057 3.592Z"></path>
                  <path fill="url(#logo_svg__h)" d="M71.954 19.901c-1.798-3.084-3.912-4.986-3.417-6.423l-2.743-.675c-.9 3.295 2.203 5.788 3.732 8.408.835-.372 2.051-1.029 2.428-1.31Z" opacity="0.51"></path>
                  <path fill="url(#logo_svg__i)" d="M70.291 23.789c-.045 2.197-2.114 3.422-3.057 3.591l-.45 2.62c3.732 0 7.149-3.38 6.205-7.606-.59.439-1.897 1.084-2.698 1.395Z" opacity="0.51"></path>
                  <path fill="var(--text-accent, #5653FE)" d="M74.393 22.352c-.404-.845-.54-2.282.045-4.268l2.293-7.943h3.013l-2.518 8.83c-.36 1.226-.54 2.24.044 2.451.81.296 2.474-1.52 3.823-5.323l2.652.591C82.216 20.873 80.283 24 77.046 24c-1.304 0-2.293-.887-2.653-1.648ZM79.069 5.07c1.034 0 1.664.676 1.664 1.563 0 .888-.72 1.606-1.664 1.606s-1.708-.718-1.708-1.606c0-.887.764-1.563 1.708-1.563Z"></path>
                  <path fill="var(--text-accent, #5653FE)" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733-4.137 0-5.081-4.352-4.407-7.31.675-2.916 1.844-5.113 2.833-6.55h3.102c-1.124 1.69-2.383 4.268-2.922 6.465-.63 2.536-.27 4.606 1.259 4.817 1.798.254 3.641-1.774 4.361-5.197.315-1.521.45-3.38.315-5.028l2.832-1.057c0 2.705-.18 7.606 2.024 7.564.81 0 1.393-.718 1.664-1.606l2.652.592c-1.214 3.296-3.192 3.718-4.496 3.718-1.034 0-2.518-.676-2.877-1.14Z"></path>
                  <path fill="url(#logo_svg__j)" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733l-.135-2.578c1.798.254 3.642-1.774 4.361-5.197.18-.872.302-1.856.347-2.847.027 1.087-.211 4.156 1.767 5.89Z" opacity="0.51"></path>
                  <defs>
                    <linearGradient id="logo_svg__a" x1="18.495" x2="12.739" y1="6.66" y2="3.037" gradientUnits="userSpaceOnUse"><stop offset="0.15"></stop><stop offset="0.826" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__b" x1="17.352" x2="25.412" y1="1.21" y2="7.318" gradientUnits="userSpaceOnUse"><stop offset="0.226"></stop><stop offset="0.629" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__c" x1="34.09" x2="36.058" y1="18.066" y2="14.168" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__d" x1="36.758" x2="34.283" y1="17.899" y2="21.63" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__e" x1="51.856" x2="45.737" y1="17.753" y2="18.753" gradientUnits="userSpaceOnUse"><stop offset="0.215"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__f" x1="58.38" x2="57.042" y1="9.483" y2="15.22" gradientUnits="userSpaceOnUse"><stop offset="0.203"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__g" x1="63.866" x2="61.623" y1="12.562" y2="16.557" gradientUnits="userSpaceOnUse"><stop offset="0.056"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__h" x1="72.648" x2="69.804" y1="22.735" y2="18.002" gradientUnits="userSpaceOnUse"><stop offset="0.14"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__i" x1="67.726" x2="69.766" y1="22.971" y2="26.421" gradientUnits="userSpaceOnUse"><stop offset="0.151"></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                    <linearGradient id="logo_svg__j" x1="93.117" x2="86.856" y1="15.042" y2="20.618" gradientUnits="userSpaceOnUse"><stop></stop><stop offset="1" stopOpacity="0"></stop></linearGradient>
                  </defs>
                </svg>
              </div>
            </nav>

            {/* Main Content - Centered Layout */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8 gap-6">
              {/* Title Section */}
              <div className="text-center space-y-2 max-w-[400px]">
                <h1 className="text-2xl font-bold text-main">
                  {scratchPage.title} <span className="text-accent">{scratchPage.titleAccent}</span>
                </h1>
                <p className="text-base text-secondary whitespace-pre-line">{scratchPage.subtitle}</p>
              </div>

              {/* Scratch Prompt - Above Card */}
              <p className="text-lg font-semibold text-main text-center">{scratchPage.scratchPrompt}</p>

              {/* Scratch Card - Centered, Fixed Square Size (360x360) */}
              <div
                ref={containerRef}
                className="relative flex-shrink-0 mx-auto"
                style={{
                  width: '360px',
                  height: '360px',
                }}
              >
                {/* Underlying content (revealed when scratched) - Light yellow-green card matching the image */}
                <div 
                  className="absolute inset-0 rounded-lg flex flex-col items-center justify-center p-6 shadow-lg"
                  style={{
                    backgroundColor: '#FCFBF5', // Light creamy yellow-beige background
                  }}
                >
                  {/* Subtle swirl patterns in background */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg opacity-30">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <path
                        d="M20,30 Q60,20 100,40 T180,35 T260,45"
                        stroke="#E8E5D0"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M40,80 Q80,70 120,90 T200,85 T280,95"
                        stroke="#E8E5D0"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M60,130 Q100,120 140,140 T220,135 T300,145"
                        stroke="#E8E5D0"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 text-center w-full">
                    {/* Top Section - 50% OFF */}
                    <div className="flex items-baseline justify-center mb-4">
                      <span 
                        className="text-7xl font-bold leading-none"
                        style={{ color: '#8BC34A' }} // Muted green color
                      >
                        {scratchPage.discountValue}
                      </span>
                      <span 
                        className="text-4xl font-bold leading-none ml-1"
                        style={{ color: '#8BC34A' }}
                      >
                        %
                      </span>
                      <span 
                        className="text-5xl font-bold leading-none ml-2"
                        style={{ color: '#8BC34A' }}
                      >
                        OFF
                      </span>
                    </div>
                    
                    {/* Dashed Divider Line */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div 
                        className="w-full border-t-2 border-dashed"
                        style={{ 
                          borderColor: '#D8D8D8',
                          maxWidth: '90%'
                        }}
                      ></div>
                      {/* Perforation circles at ends */}
                      <div 
                        className="absolute -left-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#FCFBF5' }}
                      ></div>
                      <div 
                        className="absolute -right-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#FCFBF5' }}
                      ></div>
                    </div>
                    
                    {/* Bottom Section - Promo Code */}
                    <div 
                      className="text-xl font-medium mt-2"
                      style={{ color: '#888888' }} // Medium gray
                    >
                      {scratchPage.promoCode}
                    </div>
                  </div>
                </div>

                {/* Scratch-off layer */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 cursor-pointer touch-none rounded-lg"
                  style={{
                    width: '360px',
                    height: '360px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-t-3xl rounded-b-lg p-6 w-full max-w-[400px] shadow-2xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration Emoji */}
              <div className="text-center mb-4">
                <div className="text-6xl">🎉</div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl font-bold text-main text-center mb-2">Woo hoo!</h2>

              {/* Message */}
              <p className="text-base text-secondary text-center mb-4">
                You won a promo code with
              </p>

              {/* Discount */}
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-accent">{scratchPage.discountValue}{scratchPage.discountUnit}</span>
              </div>

              {/* Auto application message */}
              <p className="text-sm text-secondary text-center mb-6">
                It will be applied automatically
              </p>

              {/* CTA Button */}
              <button
                onClick={() => {
                  setShowModal(false)
                  onComplete()
                }}
                className="w-full rounded-lg bg-accent-main p-4 text-base font-semibold uppercase text-white shadow-[0px_8px_24px_0px_rgba(86,83,254,0.3)] transition-all hover:opacity-90"
              >
                {scratchPage.cta}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
