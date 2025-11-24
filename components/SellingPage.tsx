'use client'

import { copy } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import CheckoutModal from './CheckoutModal'

interface SellingPageProps {
  onContinue: () => void
  onBack?: () => void
}

// Add global styles for button pulse animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse-shadow {
      0% {
        box-shadow: 0 0 0 0 rgba(86, 83, 254, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(86, 83, 254, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(86, 83, 254, 0);
      }
    }
    .pulse-button {
      animation: pulse-shadow 2s infinite;
    }
  `
  if (!document.head.querySelector('[data-pulse-animation]')) {
    style.setAttribute('data-pulse-animation', 'true')
    document.head.appendChild(style)
  }
}

export default function SellingPage({ onContinue, onBack }: SellingPageProps) {
  const sellingPage = copy.sellingPage
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [selectedPlan, setSelectedPlan] = useState<'1week' | '4week' | '12week'>('4week')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Load SVG content
  useEffect(() => {
    fetch('/readiness-chart-svg.txt')
      .then((res) => {
        if (!res.ok) throw new Error('SVG file not found')
        return res.text()
      })
      .then((text) => setSvgContent(text.trim()))
      .catch((err) => {
        console.error('Failed to load SVG:', err)
      })
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animate the chart curve and add vertical line
  useEffect(() => {
    if (!svgContent) return
    
    const container = chartContainerRef.current
    if (!container) return

    // Find the path element in the SVG (the curve)
    const svg = container.querySelector('svg')
    if (!svg) return

    // Find the path element that represents the curve (with gradient stroke)
    const paths = svg.querySelectorAll('path')
    let curvePath: SVGPathElement | null = null
    
    // Look for the path with gradient stroke (url(#__lottie_element_21))
    paths.forEach((path) => {
      const stroke = path.getAttribute('stroke')
      if (stroke && stroke.includes('__lottie_element_21')) {
        curvePath = path as SVGPathElement
      }
    })

    if (curvePath) {
      const pathElement = curvePath as SVGPathElement
      const pathLength = pathElement.getTotalLength()
      pathElement.style.strokeDasharray = `${pathLength}`
      pathElement.style.strokeDashoffset = `${pathLength}`
      
      // Animate the path
      setTimeout(() => {
        if (curvePath) {
          const pathEl = curvePath as SVGPathElement
          pathEl.style.transition = 'stroke-dashoffset 2s ease-in-out'
          pathEl.style.strokeDashoffset = '0'
        
          // After curve animation completes, add vertical line to SVG
          setTimeout(() => {
            // Create vertical dashed line element - perfectly vertical from green dot
            const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            verticalLine.setAttribute('x1', '619.466')
            verticalLine.setAttribute('y1', '45.925')
            verticalLine.setAttribute('x2', '619.466')
            verticalLine.setAttribute('y2', '270')
            verticalLine.setAttribute('stroke', '#E5E7EB')
            verticalLine.setAttribute('stroke-width', '1')
            verticalLine.setAttribute('stroke-dasharray', '5,5')
            verticalLine.style.opacity = '0'
            verticalLine.style.transition = 'opacity 0.3s ease-in'

            // Find the main group to append the line
            const mainGroup = svg.querySelector('g[clip-path]') || svg.querySelector('g') || svg
            mainGroup.appendChild(verticalLine)

            // Animate the line appearance
            setTimeout(() => {
              verticalLine.style.opacity = '1'
              // Calculate line length for animation (vertical distance)
              const lineLength = 270 - 45.925
              verticalLine.style.strokeDasharray = `${lineLength}`
              verticalLine.style.strokeDashoffset = `${lineLength}`
              verticalLine.style.transition = 'stroke-dashoffset 0.5s linear'
              setTimeout(() => {
                verticalLine.style.strokeDashoffset = '0'
              }, 50)
            }, 100)
          }, 2000)
        }
      }, 300)
    }
  }, [svgContent])

  // Format time as MM : SS
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`

  // Scroll to pricing section
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Get subscription text based on selected plan
  const getSubscriptionText = () => {
    const baseText = {
      '1week': 'By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 1 week at $6.93, then $6.93 every week (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See ',
      '4week': 'By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 4 weeks at $19.99, then $19.99 every 4 weeks (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See ',
      '12week': 'By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 12 weeks at $39.99, then $39.99 every 12 weeks (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See ',
    }
    return (
      <>
        {baseText[selectedPlan]}
        <span className="underline">Subscription Terms</span> for details.
      </>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Header - Desktop style */}
      <div className="fixed top-0 left-0 right-0 z-20 h-[64px] w-full flex items-center justify-center bg-white border-b border-[#E8E8E8]">
        <div className="flex max-w-[1128px] w-full items-center justify-between px-6 laptop:px-8">
          {/* Left side - Countdown Timer or Logo */}
          <div className="flex items-center gap-6">
            {timeLeft > 0 ? (
              /* Countdown Timer - only shown when active */
              <div className="text-main">
                <p className="text-[9px] font-medium">Discount expires in</p>
                <p className="min-w-[82px] text-2xl font-semibold" data-visual-test="blackout">
                  {formattedTime}
                </p>
                <div className="flex flex-row justify-evenly text-[9px] font-medium">
                  <p>min</p>
                  <p style={{ paddingLeft: '20px' }}>sec</p>
                </div>
              </div>
            ) : (
              /* Logo - only shown when timer expires */
              <svg xmlns="http://www.w3.org/2000/svg" width="99" height="30" viewBox="0 0 99 30">
                <path fill="#5653FE" d="M20.233 21.254c-2.068 0-3.822-1.225-4.541-3.17-.764-2.027-.495-4.858.674-7.816.45-1.057.945-2.028 1.529-2.916 2.113 1.057 4.406 1.902 6.97 1.902 3.012 0 6.025-1.48 6.069-4.733C30.979 2.24 28.596 0 25.224 0c-2.878 0-5.755 1.268-8.048 3.507C14.208 1.817 11.016 0 7.464 0 3.642 0 0 2.62 0 6.507c0 3.043 2.473 5.62 5.8 5.62 2.968 0 5.396-2.113 5.396-4.944 0-1.14-.764-2.282-1.664-2.789L7.644 6.296c.27.254.405.718.405 1.014 0 1.014-1.125 1.86-2.339 1.86-1.484 0-2.562-1.184-2.562-2.663 0-2.24 2.247-3.55 4.316-3.55 2.652 0 5.126 1.437 7.733 2.916a17.74 17.74 0 0 0-2.023 3.972c-1.484 4.099-1.439 7.564-.09 10.141 1.574 3 4.631 4.015 7.014 4.015 3.867 0 8.004-2.24 10.162-7.31l-2.608-.592c-.944 2.493-3.867 5.155-7.419 5.155Zm4.811-18.508c1.979 0 2.923.972 2.923 1.86 0 1.098-1.26 1.859-3.058 1.859-1.663 0-3.282-.634-4.99-1.48 1.573-1.436 3.416-2.239 5.125-2.239Z"></path>
                <path fill="#5653FE" d="M41.19 16.098c-.45 1.48-1.439 2.029-2.338 2.029-.135 0-.225 0-.36-.043 1.259-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169-3.057 0-5.665 2.155-6.879 5.832-1.349 4.183-.045 7.436 3.058 8.24.404.084.809.126 1.214.126 1.978 0 4.091-1.141 5.53-3.38.405.126.854.168 1.484.168 1.664 0 3.911-.718 5.036-4.098l-2.654-.592Zm-5.126-.084c-1.214.295-1.978 2.366-1.169 3.127-.99 1.52-2.293 2.324-3.327 2.155-1.574-.296-2.248-2.198-1.17-5.113.945-2.535 2.969-4.099 4.452-3.592.99.338 1.529 1.564 1.214 3.423Z"></path>
                <path fill="#5653FE" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.113-7.31h3.013L43.6 17.83c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.676 3.237-6.212l.81-2.789h3.012l-2.518 8.832c-.36 1.225-.54 2.24.045 2.45.81.296 2.473-1.52 3.822-5.324l2.652.592C56.415 20.873 54.481 24 51.244 24c-1.618 0-2.832-1.31-2.967-2.747Z"></path>
                <path fill="#5653FE" d="M57.832 20.493c.18-3.043 2.742-5.07 3.687-7.141l-2.608-.803c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647-.584-.465-.944-1.775.045-2.494.81-.59 2.069-.295 2.653.55.809.338 2.563.803 4.316 1.352.944.296 1.709.507 1.979 1.14.27.635-.405 1.564-1.844 3.508-1.034 1.394-2.698 3.465-2.652 4.732 0 .592.404.93.944.93 1.123 0 3.192-1.352 4.63-5.282l2.654.592C67.228 21.507 64.71 24 61.564 24c-2.158 0-3.867-1.521-3.732-3.507Z"></path>
                <path fill="#5653FE" d="m77.755 16.69-2.653-.592c-.584 1.648-1.664 2.831-3.147 3.803-1.799-3.084-3.912-4.986-3.418-6.422.27-.888 1.215-1.226 1.98-.972.674.211.898.93.898 1.14l2.248-.802c-.045-.465-.27-1.141-.674-1.69-.675-.888-1.798-1.353-3.012-1.353-2.204 0-3.688 1.226-4.182 3-.9 3.296 2.203 5.79 3.732 8.41-.72.337-1.53.675-2.338 1.013-3.957 1.648-4.856 3.465-4.496 5.07.36 1.522 1.933 2.705 4.091 2.705 3.732 0 7.149-3.38 6.205-7.606 1.798-1.183 3.687-2.62 4.766-5.704ZM67.234 27.38c-.9.17-1.574-.042-1.664-.507-.09-.38.09-1.014 1.844-1.859.989-.465 1.933-.845 2.877-1.226-.045 2.198-2.113 3.423-3.057 3.592Z"></path>
                <path fill="#5653FE" d="M74.393 22.352c-.404-.845-.54-2.282.045-4.268l2.293-7.943h3.013l-2.518 8.83c-.36 1.226-.54 2.24.044 2.451.81.296 2.474-1.52 3.823-5.323l2.652.591C82.216 20.873 80.283 24 77.046 24c-1.304 0-2.293-.887-2.653-1.648ZM79.069 5.07c1.034 0 1.664.676 1.664 1.563 0 .888-.72 1.606-1.664 1.606s-1.708-.718-1.708-1.606c0-.887.764-1.563 1.708-1.563Z"></path>
                <path fill="#5653FE" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733-4.137 0-5.081-4.352-4.407-7.31.675-2.916 1.844-5.113 2.833-6.55h3.102c-1.124 1.69-2.383 4.268-2.922 6.465-.63 2.536-.27 4.606 1.259 4.817 1.798.254 3.641-1.774 4.361-5.197.315-1.521.45-3.38.315-5.028l2.832-1.057c0 2.705-.18 7.606 2.024 7.564.81 0 1.393-.718 1.664-1.606l2.652.592c-1.214 3.296-3.192 3.718-4.496 3.718-1.034 0-2.518-.676-2.877-1.14Z"></path>
              </svg>
            )}
          </div>

          {/* GET MY PLAN Button - Right aligned */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="pulse-button px-6 py-2 bg-[#5653FE] text-white rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#4442D9] transition-colors"
          >
            GET MY PLAN
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[64px] w-full">
        {/* Now vs Goal Section */}
        <div className="grid grid-cols-2 gap-8 bg-[#F5F5F5] px-5 py-8 max-w-[650px] mx-auto">
          {/* Now Column */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 text-[#14142B]">Now</h2>
            <img
              src="https://d3kigabz1zn79w.cloudfront.net/now.webp"
              alt="Now"
              className="w-full max-w-[173px] h-auto mb-4"
            />

            {/* AI skills section */}
            <div className="w-full max-w-[202px]">
              <h3 className="text-sm font-bold mb-2 text-[#14142B]">AI skills</h3>
              <div className="mb-1">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_wealth-growth-funnel_selling-page_skills-now.webp"
                  alt="Skills Now"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs font-medium text-[#6B7280] mb-4">Moderate</p>

              {/* Practical Readiness section */}
              <h3 className="text-sm font-bold mb-2 text-[#14142B]">Practical Readiness</h3>
              <div className="mb-1">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_wealth-growth-funnel_selling-page_power-now.svg"
                  alt="Power Now"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs font-medium text-[#6B7280]">Limited</p>
            </div>
          </div>

          {/* Goal Column */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 text-[#14142B]">Goal</h2>
            <img
              src="https://d3kigabz1zn79w.cloudfront.net/after.webp"
              alt="Goal"
              className="w-full max-w-[173px] h-auto mb-4"
            />

            {/* AI skills section */}
            <div className="w-full max-w-[202px]">
              <h3 className="text-sm font-bold mb-2 text-[#14142B]">AI skills</h3>
              <div className="mb-1">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_wealth-growth-funnel_selling-page_skills-goal.webp"
                  alt="Skills Goal"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs font-medium text-[#6B7280] mb-4">High</p>

              {/* Practical Readiness section */}
              <h3 className="text-sm font-bold mb-2 text-[#14142B]">Practical Readiness</h3>
              <div className="mb-1">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_wealth-growth-funnel_selling-page_power-goal.svg"
                  alt="Power Goal"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs font-medium text-[#6B7280]">High</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center py-3 bg-[#F5F5F5]">
          <p className="text-xs text-[#6B7280]">This is not a guarantee or promise of results.</p>
        </div>

        {/* Your readiness Section */}
        <div className="bg-white py-12 px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#24234C] mb-6">
              Your readiness: <span className="text-[#7ABF59]">83%</span>
            </h2>

            <div className="bg-[#F5F5F5] rounded-lg p-6 max-w-[700px] mx-auto">
              <div className="flex items-center justify-center gap-3">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_wealth-growth-funnel_selling-page_ab-test-assets_readiness-block_lightbulb.webp"
                  alt="Lightbulb"
                  className="w-12 h-12"
                />
                <p className="text-lg text-[#6B7280]">
                  <span className="font-bold text-[#7ABF59]">4-week</span> program is enough for you to start your AI journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI is easier than you think Section */}
        <div className="bg-[#EEEEFF] py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-4xl font-bold text-[#24234C] text-center mb-12">
              AI is easier than you think
            </h2>

            <div className="flex flex-col laptop:flex-row items-center justify-center laptop:gap-6 gap-8">
              {/* Guy image on the left */}
              <img
                alt=""
                fetchpriority="high"
                width="150"
                height="210"
                decoding="async"
                data-nimg="1"
                className="h-[210px] w-[150px] object-cover laptop:h-[280px] laptop:w-[200px]"
                src="https://d3kigabz1zn79w.cloudfront.net/ai is easier.webp"
                style={{ color: 'transparent' }}
              />

              {/* Day 1-4 cards in the middle */}
              <img
                alt=""
                fetchpriority="high"
                width="150"
                height="210"
                decoding="async"
                data-nimg="1"
                className="h-[210px] w-[150px] laptop:h-[280px] laptop:w-[200px]"
                src="https://d3kigabz1zn79w.cloudfront.net/migrated_d14fbcf1p6wyzn_funnel-images_c13_v3_adigp_nt_selling-page_daily-challenge_1.webp"
                style={{ color: 'transparent' }}
              />

              {/* Benefits on the right */}
              <div className="flex flex-col gap-4 laptop:justify-center">
                <div className="flex items-center justify-center laptop:justify-start">
                  <img
                    src="https://d3kigabz1zn79w.cloudfront.net/investingcondition_emoji-6.webp"
                    className="mr-4 inline h-[34px] object-cover"
                    alt=""
                    height="34"
                    width="24"
                  />
                  <p className="text-sm laptop:text-base">No prior AI knowledge is required</p>
                </div>

                <div className="flex items-center justify-center laptop:justify-start">
                  <img
                    src="https://d3kigabz1zn79w.cloudfront.net/investingcondition_emoji-6.webp"
                    className="mr-4 inline h-[34px] object-cover"
                    alt=""
                    height="34"
                    width="24"
                  />
                  <p className="text-sm laptop:text-base">No need for a university degree</p>
                </div>

                <div className="flex items-center justify-center laptop:justify-start">
                  <img
                    src="https://d3kigabz1zn79w.cloudfront.net/investingcondition_emoji-6.webp"
                    className="mr-4 inline h-[34px] object-cover"
                    alt=""
                    height="34"
                    width="24"
                  />
                  <p className="text-sm laptop:text-base">Work at your own pace and terms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Try Coursiv and you will Section */}
        <div className="bg-white py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-center text-2xl font-bold text-main tablet:pb-2 tablet:text-3xl laptop:pb-4 laptop:text-4xl mb-8">
              Try Coursiv and you will:
            </h1>

            {/* Bullet Points */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Master AI tools */}
              <div className="flex flex-row items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="flex-none">
                  <rect width="20" height="20" x="4" y="4" rx="10" fill="#5653FE"></rect>
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18.667 10.5-6.417 6.417L9.334 14"></path>
                </svg>
                <div className="font-regular max-w-[264] text-sm text-main tablet:text-base">
                  <p>Master AI tools that can boost your income</p>
                </div>
              </div>

              {/* Discover new professions */}
              <div className="flex flex-row items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="flex-none">
                  <rect width="20" height="20" x="4" y="4" rx="10" fill="#5653FE"></rect>
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18.667 10.5-6.417 6.417L9.334 14"></path>
                </svg>
                <div className="font-regular max-w-[264] text-sm text-main tablet:text-base">
                  <p>Discover new professions and income sources with AI</p>
                </div>
              </div>

              {/* Learn key AI terms */}
              <div className="flex flex-row items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="flex-none">
                  <rect width="20" height="20" x="4" y="4" rx="10" fill="#5653FE"></rect>
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18.667 10.5-6.417 6.417L9.334 14"></path>
                </svg>
                <div className="font-regular max-w-[264] text-sm text-main tablet:text-base">
                  <p>Learn key AI terms and lessons</p>
                </div>
              </div>
            </div>

            {/* Two boxes - Your goal and Your target */}
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 max-w-[600px] mx-auto">
              {/* Your goal box */}
              <div className="bg-[#F5F5F5] rounded-lg p-6 text-center">
                <div className="mb-1 flex w-full items-center text-main justify-center">
                  <img
                    alt=""
                    loading="lazy"
                    width="16"
                    height="16"
                    decoding="async"
                    data-nimg="1"
                    className="mr-2 h-[16px] w-[16px] object-cover"
                    src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_get_out_of_debt_selling-page_goal.svg"
                    style={{ color: 'transparent' }}
                  />
                  <span className="truncate text-[12px] leading-normal">Your goal</span>
                </div>
                <h3 className="text-xl font-bold text-main">Build personal projects</h3>
              </div>

              {/* Your target box */}
              <div className="bg-[#F5F5F5] rounded-lg p-6 text-center">
                <div className="mb-1 flex w-full items-center text-main justify-center">
                  <img
                    alt=""
                    loading="lazy"
                    width="16"
                    height="16"
                    decoding="async"
                    data-nimg="1"
                    className="mr-2 h-[16px] w-[16px] object-cover"
                    src="https://d3kigabz1zn79w.cloudfront.net/migrated_d2vm05b1botqyl_images_get_out_of_debt_selling-page_stats_icon.svg"
                    style={{ color: 'transparent' }}
                  />
                  <span className="truncate text-[12px] leading-normal">Your target</span>
                </div>
                <h3 className="text-xl font-bold text-main">Saving for a home</h3>
              </div>
            </div>
          </div>
        </div>

        {/* AI Challenge Image */}
        <div className="flex justify-center bg-white py-8">
          <div className="max-w-[368px] w-full">
            <img src="https://d3kigabz1zn79w.cloudfront.net/EN.webp" alt="ai-challenge" className="h-auto w-full" />
          </div>
        </div>

        {/* Purchase Stats Text */}
        <div className="bg-white py-6">
          <p className="text-center text-base font-bold leading-[150%] text-main tablet:text-lg laptop:text-2xl">
            203 people purchased personal <br /> AI-learning plans in the last hour
          </p>
        </div>

        {/* Ticker Tape - Moving Stats */}
        <div className="bg-white pb-6">
          <div className="overflow-hidden max-w-[368px] mx-auto">
            <style jsx>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .ticker-tape {
                animation: scroll 120s linear infinite;
                width: max-content;
              }
            `}</style>
          <div className="ticker-tape flex items-center gap-[10px]">
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.br*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.le*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.yo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">john.ki*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.da*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.ma*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">michael.ha*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">john.mu*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.mo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.ro*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.co*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.ga*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.al*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">michael.ta*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.ba*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.hi*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">jane.ri*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">jane.ra*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.jo*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.be*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">anna.wi*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.ma*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">anna.jo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.re*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.mi*** 1-week plan</p></div>

            {/* Duplicate for seamless loop */}
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.br*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.le*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.yo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">john.ki*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.da*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.ma*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">michael.ha*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">john.mu*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.mo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.ro*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.co*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.ga*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.al*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">michael.ta*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.ba*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.hi*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">jane.ri*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">jane.ra*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">david.jo*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">emily.be*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">anna.wi*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sarah.ma*** 1-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">anna.jo*** 12-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">chris.re*** 4-week plan</p></div>
            <div className="flex h-[26px] items-center justify-center rounded border border-secondary px-3"><p className="whitespace-nowrap text-xs font-medium leading-[150%] text-secondary">sophia.mi*** 1-week plan</p></div>
          </div>
          </div>
        </div>

        {/* Choose the best plan for you Section */}
        <div ref={pricingRef} className="bg-white py-12 px-6">
          <h2 className="text-center text-2xl font-bold text-main tablet:text-3xl laptop:text-4xl mb-8">
            Choose the best plan for you
          </h2>

          <div className="max-w-[1200px] mx-auto grid grid-cols-1 tablet:grid-cols-3 gap-6">
            {/* 1-WEEK PLAN */}
            <div
              onClick={() => setSelectedPlan('1week')}
              className={`relative flex w-full flex-col rounded-lg border cursor-pointer transition-all ${
                selectedPlan === '1week' ? 'border-accent-main opacity-100' : 'border-gray-300 opacity-50'
              }`}
            >
              <div className="flex w-full items-start justify-between py-3 px-4 gap-2 laptop:min-h-[193px] laptop:flex-col laptop:items-start laptop:gap-4 laptop:py-8">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-main laptop:hidden">
                    {selectedPlan === '1week' && <div className="h-2.5 w-2.5 rounded-full bg-accent-main"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase laptop:text-2xl text-main">1-WEEK PLAN</p>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-secondary line-through">$13.86</span>
                      <span className="text-base font-bold text-[#4F981D]">$6.93</span>
                    </div>
                    {/* Per day pricing - mobile */}
                    <div className="mt-2 laptop:hidden">
                      <span className="text-2xl font-bold text-main">$0.99</span>
                      <span className="text-sm text-secondary ml-1">per day</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 laptop:w-full">
                  <div className="mb-4 hidden h-[1px] w-full bg-[#F1F1F1] laptop:block"></div>
                  <div className="hidden items-end gap-1 font-bold laptop:flex">
                    <div className="text-3xl leading-none text-main">$0.99</div>
                    <div className="text-base leading-none text-main">per day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-WEEK PLAN - MOST POPULAR */}
            <div
              onClick={() => setSelectedPlan('4week')}
              className={`relative flex w-full flex-col rounded-lg cursor-pointer transition-all ${
                selectedPlan === '4week' ? 'opacity-100 border-accent-main' : 'opacity-50 border-gray-300'
              }`}
              style={{ border: selectedPlan === '4week' ? '1px solid #5653FE' : '1px solid #d1d5db' }}
            >
              <div className="flex h-[26px] w-full items-center justify-center gap-1 rounded-t-lg bg-accent-main text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="fill-white">
                  <path d="M8.746 1.373 5.053 5.067a1.332 1.332 0 0 0-.386.94v6.66C4.667 13.4 5.266 14 6 14h6c.533 0 1.013-.32 1.226-.807L15.4 8.12c.56-1.32-.407-2.787-1.84-2.787H9.793l.634-3.053a1.005 1.005 0 0 0-.274-.913.992.992 0 0 0-1.407.006ZM2 14c.733 0 1.333-.6 1.333-1.333V7.333C3.333 6.6 2.733 6 2 6 1.266 6 .667 6.6.667 7.333v5.334C.667 13.4 1.267 14 2 14Z"></path>
                </svg>
                <p className="text-center font-semibold uppercase text-white">MOST POPULAR</p>
              </div>
              <div className="flex w-full items-start justify-between border py-3 px-4 gap-2 laptop:min-h-[193px] laptop:flex-col laptop:items-start laptop:gap-4 laptop:py-8 rounded-lg border-sp-accent rounded-t-none">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-sp-accent laptop:hidden">
                    {selectedPlan === '4week' && <div className="h-2.5 w-2.5 rounded-full bg-accent-main"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase laptop:text-2xl text-secondary">4-WEEK PLAN</p>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-secondary line-through">$39.99</span>
                      <span className="text-base font-bold text-[#4F981D]">$19.99</span>
                    </div>
                    {/* Per day pricing - mobile */}
                    <div className="mt-2 laptop:hidden">
                      <span className="text-2xl font-bold text-secondary">$0.71</span>
                      <span className="text-sm text-secondary ml-1">per day</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 laptop:w-full">
                  <div className="mb-4 hidden h-[1px] w-full bg-[#F1F1F1] laptop:block"></div>
                  <div className="hidden items-end gap-1 font-bold laptop:flex">
                    <div className="text-3xl leading-none text-secondary">$0.71</div>
                    <div className="text-base leading-none text-secondary">per day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 12-WEEK PLAN */}
            <div
              onClick={() => setSelectedPlan('12week')}
              className={`relative flex w-full flex-col rounded-lg border cursor-pointer transition-all ${
                selectedPlan === '12week'
                  ? 'border-accent-main opacity-100'
                  : 'border-gray-300 opacity-50'
              }`}
              style={selectedPlan === '12week' ? { boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 8px 1px' } : {}}
            >
              <div className="flex w-full items-start justify-between py-3 px-4 gap-2 laptop:min-h-[193px] laptop:flex-col laptop:items-start laptop:gap-4 laptop:py-8">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-main laptop:hidden">
                    {selectedPlan === '12week' && <div className="h-2.5 w-2.5 rounded-full bg-accent-main"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase laptop:text-2xl text-main">12-WEEK PLAN</p>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-secondary line-through">$79.99</span>
                      <span className="text-base font-bold text-[#4F981D]">$39.99</span>
                    </div>
                    {/* Per day pricing - mobile */}
                    <div className="mt-2 laptop:hidden">
                      <span className="text-2xl font-bold text-main">$0.48</span>
                      <span className="text-sm text-secondary ml-1">per day</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 laptop:w-full">
                  <div className="mb-4 hidden h-[1px] w-full bg-[#F1F1F1] laptop:block"></div>
                  <div className="hidden items-end gap-1 font-bold laptop:flex">
                    <div className="text-3xl leading-none text-main">$0.48</div>
                    <div className="text-base leading-none text-main">per day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-accent-main">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-sm text-secondary">People using plan for 3 months achieve twice as many results as for 1 month</p>
          </div>
          <p className="text-center text-xs text-secondary mt-2">*According to a research by Coursiv, 2023</p>

          {/* Subscription terms */}
          <div className="max-w-[800px] mx-auto mt-8 text-center text-sm text-secondary">
            <p>{getSubscriptionText()}</p>
          </div>

          {/* GET MY PLAN Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="pulse-button px-12 py-4 bg-accent-main text-white rounded-lg font-bold text-base uppercase tracking-wide hover:bg-[#4442D9] transition-colors"
            >
              GET MY PLAN
            </button>
          </div>

          {/* Pay safe & secure Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span className="text-[#4CAF50] font-semibold">Pay safe & secure</span>
            </div>

            {/* Payment Logos */}
            <div className="mb-4 mt-5 flex items-center justify-evenly">
              <img alt="" className="h-auto w-[184px]" src="https://d14fbcf1p6wyzn.cloudfront.net/funnel-images/c13_selling-page_redesign/payment_methods.webp" />
            </div>

            <p className="text-sm text-secondary">Coursiv Limited, Limassol, Cyprus</p>
          </div>
        </div>

        {/* Money-Back Guarantee Section */}
        <div className="bg-[#E8F5E9] py-16 px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="flex justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="132" fill="none">
                <path fill="#7ABF4C" d="m96 118.891-19.037-4.377-8.498 17.484-18.826-39.054L48 89.539l-1.64 3.405-18.826 39.054-8.499-17.484L0 118.891l18.193-37.743 4.024-8.351 1.91-3.96 23.872 11.365 23.875-11.365 1.909 3.96 4.024 8.35L96 118.892Z"></path>
                <path fill="#7ABF4C" d="m27.535 132-8.498-17.486L0 118.891l24.126-50.054 27.535 13.11L27.535 132Z"></path>
                <path fill="#7ABF4C" d="m68.467 132 8.499-17.486L96 118.891 71.874 68.837 44.34 81.947 68.467 132Z"></path>
                <path fill="#D1D3D4" d="M73.783 72.797c-6.511 6.738-15.663 10.94-25.784 10.94a35.72 35.72 0 0 1-14.395-3.009 35.887 35.887 0 0 1-11.387-7.931l-4.024 8.35c2.343.308 5.4-.239 7.079.875 1.216.808 1.894 2.643 2.635 4.371.68 1.588 1.42 3.08 2.675 3.603 2.585 1.066 6.622-2.454 9.43-1.903 2.196.432 4.16 3.62 6.346 4.851l1.64-3.405 1.641 3.405c2.188-1.228 4.153-4.419 6.348-4.85 2.809-.552 6.843 2.968 9.428 1.902 2.63-1.084 2.974-6.42 5.313-7.974 1.676-1.114 4.736-.567 7.08-.874l-4.025-8.351Z" style={{ mixBlendMode: 'multiply' }}></path>
                <path fill="#fff" d="M48.001 81.662c20.253 0 36.672-16.317 36.672-36.445C84.673 25.09 68.254 8.773 48 8.773c-20.253 0-36.671 16.317-36.671 36.445 0 20.127 16.418 36.444 36.671 36.444Z"></path>
                <path fill="#7ABF4C" d="M48.001 77.65c18.024 0 32.635-14.52 32.635-32.433 0-17.912-14.611-32.432-32.635-32.432-18.023 0-32.634 14.52-32.634 32.433C15.367 63.13 29.977 77.65 48 77.65Z"></path>
                <path fill="#D1D3D4" d="M16.62 46.715c0-17.912 14.61-32.432 32.635-32.432 9.74 0 18.479 4.241 24.458 10.965a32.655 32.655 0 0 0-25.714-12.463c-18.025 0-32.635 14.52-32.635 32.432 0 8.234 3.09 15.751 8.177 21.47a32.162 32.162 0 0 1-6.92-19.972Z" style={{ mixBlendMode: 'multiply' }}></path>
                <path fill="#D1D3D4" d="m38.362 61.068-9.953-9.891a4.271 4.271 0 0 1 0-6.067l.063-.062a4.336 4.336 0 0 1 6.104 0l6.188 6.149c.452.45 1.185.45 1.638 0L62.936 30.79a4.336 4.336 0 0 1 6.104 0l.063.062a4.271 4.271 0 0 1 0 6.067l-24.3 24.15a4.572 4.572 0 0 1-6.438 0h-.003Z" style={{ mixBlendMode: 'multiply' }}></path>
                <path fill="#fff" d="m37.608 60.32-9.952-9.892a4.271 4.271 0 0 1 0-6.067l.062-.062a4.336 4.336 0 0 1 6.105 0l6.187 6.149c.452.45 1.186.45 1.638 0L62.182 30.04a4.336 4.336 0 0 1 6.104 0l.063.062a4.271 4.271 0 0 1 0 6.067l-24.3 24.15a4.572 4.572 0 0 1-6.438 0h-.002Z"></path>
                <path fill="#7ABF4C" d="M88.132 53.151c.543-2.708 5.368-5.068 5.368-7.934 0-2.866-4.825-5.225-5.368-7.936-.555-2.791 2.987-6.803 1.914-9.372-.522-1.256-2.027-1.985-3.625-2.661-1.736-.737-3.58-1.409-4.398-2.62-1.578-2.341.148-7.402-1.85-9.386-.83-.827-2.195-1.014-3.674-1.056-2.08-.068-4.39.137-5.768-.78-.787-.524-1.347-1.472-1.844-2.546-.985-2.117-1.724-4.71-3.47-5.43-2.584-1.066-6.619 2.454-9.43 1.903C53.26 4.798 50.885 0 48.001 0c-2.884 0-5.258 4.796-7.986 5.333a3.38 3.38 0 0 1-.957.045c-2.71-.205-6.167-2.899-8.473-1.948-2.63 1.086-2.975 6.421-5.313 7.977-2.354 1.568-7.446-.148-9.443 1.835-1.998 1.984-.272 7.045-1.85 9.387-1.564 2.324-6.933 2.663-8.023 5.277-.955 2.292 1.754 5.725 1.96 8.421.027.332.017.65-.046.954-.542 2.711-5.368 5.07-5.368 7.937 0 2.865 4.826 5.225 5.368 7.933.555 2.792-2.987 6.806-1.914 9.375.724 1.735 3.334 2.472 5.464 3.445 1.078.5 2.035 1.056 2.56 1.835.92 1.366.716 3.663.784 5.732.05 1.473.236 2.829 1.065 3.653 1.994 1.984 7.086.27 9.443 1.837 1.218.81 1.894 2.644 2.635 4.372.68 1.587 1.42 3.08 2.678 3.602 2.585 1.066 6.62-2.454 9.43-1.902 2.728.537 5.102 5.335 7.986 5.335 2.884 0 5.258-4.8 7.986-5.335 2.809-.552 6.846 2.968 9.43 1.902 2.63-1.086 2.975-6.42 5.314-7.974 2.354-1.568 7.446.147 9.443-1.837 1.997-1.985.271-7.046 1.849-9.385 1.565-2.324 6.933-2.666 8.023-5.28 1.073-2.569-2.47-6.58-1.914-9.375Zm-40.13 27.592a35.71 35.71 0 0 1-14.395-3.008 35.907 35.907 0 0 1-13.133-9.874 35.557 35.557 0 0 1-4.346-6.568 35.153 35.153 0 0 1-3.874-16.075A35.139 35.139 0 0 1 17.35 26.95a35.884 35.884 0 0 1 12.27-12.193A35.69 35.69 0 0 1 48 9.69a35.674 35.674 0 0 1 16.176 3.852 36.027 36.027 0 0 1 6.609 4.32 35.776 35.776 0 0 1 9.935 13.051 35.116 35.116 0 0 1 3.027 14.306c0 19.59-16.034 35.525-35.747 35.525Z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-main mb-6">Money-Back Guarantee</h2>
            <p className="text-base text-secondary leading-relaxed mb-4">
              We are so confident in our service that we are ready to offer a full refund within 30 days of your initial purchase OR before the end of your first subscription period, whichever comes first. Additional terms and conditions apply.
            </p>
            <p className="text-sm text-secondary">
              For full details, please review our complete refund policy <span className="underline">here</span>.
            </p>
          </div>
        </div>

        {/* Access Coursiv Anywhere Section */}
        <div className="bg-white py-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold text-main text-center mb-12">
              Access Coursiv anywhere<br />using your mobile device
            </h2>
            <div className="flex h-[540px] min-h-[540px] w-full flex-col items-center justify-center">
              <div className="relative h-[540px] min-h-[540px] w-[1050px] overflow-hidden">
                {/* 5 Phone Images - Sliding Carousel */}
                <div className="relative w-full h-[490px] pt-8">
                  <div
                    className="flex items-center absolute left-1/2 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(calc(-50% - ${currentSlide * 210}px))`
                    }}
                  >
                    {/* Render multiple phone copies for smooth infinite scroll */}
                    {[...Array(15)].map((_, idx) => {
                      const phoneNum = (idx % 5) + 1
                      const centerIndex = 7
                      const distanceFromCenter = Math.abs(idx - centerIndex - currentSlide)
                      const isCenter = distanceFromCenter === 0

                      return (
                        <div
                          key={idx}
                          className="flex-shrink-0 flex items-center justify-center transition-all duration-500"
                          style={{
                            width: '180px',
                            marginRight: '30px'
                          }}
                        >
                          <div
                            className="transition-transform duration-500"
                            style={{
                              transform: isCenter ? 'scale(1.25)' : 'scale(1)'
                            }}
                          >
                            <img
                              alt=""
                              width={204}
                              height={415}
                              src={`https://d3kigabz1zn79w.cloudfront.net/migrated_d14fbcf1p6wyzn_funnel-images_c13_v3_adigp_nt_selling-page_appoverview_${phoneNum}.webp`}
                              style={{
                                color: 'transparent',
                                minHeight: '322px',
                                minWidth: '154px',
                                height: 'auto'
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Navigation and Pagination */}
                <div className="absolute bottom-0 right-0 left-0 z-10 my-0 mx-auto flex h-6 min-h-[24px] w-[244px] flex-row justify-between">
                  {/* Left Arrow */}
                  <img
                    alt=""
                    width={24}
                    height={24}
                    className="swiper-button-prev mr-10 h-6 w-6 cursor-pointer"
                    src="/assets/icons/arrow-left.svg"
                    style={{ color: 'transparent' }}
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? 4 : prev - 1))}
                  />

                  {/* Pagination Dots */}
                  <span className="absolute top-2 right-0 left-0 my-0 mx-auto flex w-[132px] flex-row items-center justify-between">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <span
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`carousel-bullet h-2 w-2 rounded-lg cursor-pointer ${
                          currentSlide === index ? 'bg-accent-main' : 'bg-accent-secondary'
                        }`}
                      />
                    ))}
                  </span>

                  {/* Right Arrow */}
                  <img
                    alt=""
                    width={24}
                    height={24}
                    className="swiper-button-next ml-10 h-6 w-6 rotate-180 cursor-pointer"
                    src="/assets/icons/arrow-left.svg"
                    style={{ color: 'transparent' }}
                    onClick={() => setCurrentSlide((prev) => (prev === 4 ? 0 : prev + 1))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get Section */}
        <div className="bg-white py-16 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-4xl font-bold text-main text-center mb-12">What you get</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="mr-3 flex h-5 min-h-[20px] w-5 min-w-[20px] flex-row items-center justify-center rounded-full bg-[rgba(86,83,254,0.2)]">
                  <span className="block h-[10px] w-[10px] rounded-full bg-accent-main"></span>
                </span>
                <p className="text-lg text-main">Guides on Trending AI tools</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mr-3 flex h-5 min-h-[20px] w-5 min-w-[20px] flex-row items-center justify-center rounded-full bg-[rgba(86,83,254,0.2)]">
                  <span className="block h-[10px] w-[10px] rounded-full bg-accent-main"></span>
                </span>
                <p className="text-lg text-main">Access to beginner-friendly lessons</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mr-3 flex h-5 min-h-[20px] w-5 min-w-[20px] flex-row items-center justify-center rounded-full bg-[rgba(86,83,254,0.2)]">
                  <span className="block h-[10px] w-[10px] rounded-full bg-accent-main"></span>
                </span>
                <p className="text-lg text-main">Comprehensive skill-enhancing courses</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mr-3 flex h-5 min-h-[20px] w-5 min-w-[20px] flex-row items-center justify-center rounded-full bg-[rgba(86,83,254,0.2)]">
                  <span className="block h-[10px] w-[10px] rounded-full bg-accent-main"></span>
                </span>
                <p className="text-lg text-main">Resources for work-life balance</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mr-3 flex h-5 min-h-[20px] w-5 min-w-[20px] flex-row items-center justify-center rounded-full bg-[rgba(86,83,254,0.2)]">
                  <span className="block h-[10px] w-[10px] rounded-full bg-accent-main"></span>
                </span>
                <p className="text-lg text-main">24/7 chat with online support to get all answers and reduce mistakes</p>
              </div>
            </div>
          </div>
        </div>

        {/* People Love Coursiv Section */}
        <div className="bg-white py-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-4xl font-bold text-main text-center mb-12">People love Coursiv</h2>
            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://d3kigabz1zn79w.cloudfront.net/user-review_staring-emoji-6.webp" width="32" height="32" alt="" />
                  <span className="font-semibold text-main">@der_kennndy1</span>
                </div>
                <p className="text-sm text-secondary mb-4">
                  "The learning is straightforward and has all the necessary information! It serves as a great starting point if you are new to AI."
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://d3kigabz1zn79w.cloudfront.net/user-review_staring-emoji-6.webp" width="32" height="32" alt="" />
                  <span className="font-semibold text-main">@dexter_brechtefeld</span>
                </div>
                <p className="text-sm text-secondary mb-4">
                  "Coursiv's wide range of educational materials and interactive features enables users of all levels to easily understand complicated AI principles. Kudos to Coursiv for pioneering a new approach to AI learning!"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://d3kigabz1zn79w.cloudfront.net/user-review_staring-emoji-6.webp" width="32" height="32" alt="" />
                  <span className="font-semibold text-main">@pattykivuva</span>
                </div>
                <p className="text-sm text-secondary mb-4">
                  "Coursiv has simplified understanding complex topics and enhancing my skills across subjects. The customized learning tailored to my needs has significantly boosted my progress towards achieving my goals."
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={{
          name: selectedPlan === '1week' ? '1-Week Challenge' : selectedPlan === '4week' ? '4-Week Challenge' : '12-Week Challenge',
          price: selectedPlan === '1week' ? '$6.93' : selectedPlan === '4week' ? '$19.99' : '$39.99',
          pricePerDay: selectedPlan === '1week' ? '$0.99/day' : selectedPlan === '4week' ? '$0.71/day' : '$0.48/day',
          duration: selectedPlan === '1week' ? '1 week' : selectedPlan === '4week' ? '4 weeks' : '12 weeks'
        }}
      />
    </div>
  )
}
