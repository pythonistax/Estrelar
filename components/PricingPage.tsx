'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CheckoutModal from './CheckoutModal'

interface PricingPageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function PricingPage({ onContinue, onBack }: PricingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('4-week')
  const [showCheckout, setShowCheckout] = useState(false)

  const plans = {
    '1-week': { name: '1-WEEK PLAN', price: '€13.86', pricePerDay: '€1.98' },
    '4-week': { name: '4-WEEK PLAN', price: '€39.99', pricePerDay: '€1.43' },
    '12-week': { name: '12-WEEK PLAN', price: '€79.99', pricePerDay: '€0.95' },
  }

  const handleGetPlan = () => {
    setShowCheckout(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedPlan={plans[selectedPlan as keyof typeof plans]}
      />
      {/* Header */}
      <nav className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-200">
        {/* Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" width="99" height="30">
          <path fill="#5653FE" d="M20.233 21.254c-2.068 0-3.822-1.225-4.541-3.17-.764-2.027-.495-4.858.674-7.816.45-1.057.945-2.028 1.529-2.916 2.113 1.057 4.406 1.902 6.97 1.902 3.012 0 6.025-1.48 6.069-4.733C30.979 2.24 28.596 0 25.224 0c-2.878 0-5.755 1.268-8.048 3.507C14.208 1.817 11.016 0 7.464 0 3.642 0 0 2.62 0 6.507c0 3.043 2.473 5.62 5.8 5.62 2.968 0 5.396-2.113 5.396-4.944 0-1.14-.764-2.282-1.664-2.789L7.644 6.296c.27.254.405.718.405 1.014 0 1.014-1.125 1.86-2.339 1.86-1.484 0-2.562-1.184-2.562-2.663 0-2.24 2.247-3.55 4.316-3.55 2.652 0 5.126 1.437 7.733 2.916a17.74 17.74 0 0 0-2.023 3.972c-1.484 4.099-1.439 7.564-.09 10.141 1.574 3 4.631 4.015 7.014 4.015 3.867 0 8.004-2.24 10.162-7.31l-2.608-.592c-.944 2.493-3.867 5.155-7.419 5.155Zm4.811-18.508c1.979 0 2.923.972 2.923 1.86 0 1.098-1.26 1.859-3.058 1.859-1.663 0-3.282-.634-4.99-1.48 1.573-1.436 3.416-2.239 5.125-2.239Z"></path>
          <path fill="#5653FE" d="M41.19 16.098c-.45 1.48-1.439 2.029-2.338 2.029-.135 0-.225 0-.36-.043 1.259-4.056.135-7.31-2.922-8.113-.36-.084-.855-.169-1.17-.169-3.057 0-5.665 2.155-6.879 5.832-1.349 4.183-.045 7.436 3.058 8.24.404.084.809.126 1.214.126 1.978 0 4.091-1.141 5.53-3.38.405.126.854.168 1.484.168 1.664 0 3.911-.718 5.036-4.098l-2.654-.592Zm-5.126-.084c-1.214.295-1.978 2.366-1.169 3.127-.99 1.52-2.293 2.324-3.327 2.155-1.574-.296-2.248-2.198-1.17-5.113.945-2.535 2.969-4.099 4.452-3.592.99.338 1.529 1.564 1.214 3.423Z"></path>
          <path fill="#5653FE" d="M48.277 21.253C46.793 22.943 45.174 24 43.42 24c-2.787 0-3.956-2.409-2.742-6.55l2.113-7.31h3.013L43.6 17.83c-.494 1.775-.72 3.212-.09 3.508.675.296 1.979-.422 3.373-2.197 1.304-1.648 2.383-3.676 3.237-6.212l.81-2.789h3.012l-2.518 8.832c-.36 1.225-.54 2.24.045 2.45.81.296 2.473-1.52 3.822-5.324l2.652.592C56.415 20.873 54.481 24 51.244 24c-1.618 0-2.832-1.31-2.967-2.747Z"></path>
          <path fill="#5653FE" d="M57.832 20.493c.18-3.043 2.742-5.07 3.687-7.141l-2.608-.803c-.045.887-.63 3.17-1.08 4.394l-2.607-.634c.495-1.056 1.079-3.718 1.079-4.647-.584-.465-.944-1.775.045-2.494.81-.59 2.069-.295 2.653.55.809.338 2.563.803 4.316 1.352.944.296 1.709.507 1.979 1.14.27.635-.405 1.564-1.844 3.508-1.034 1.394-2.698 3.465-2.652 4.732 0 .592.404.93.944.93 1.123 0 3.192-1.352 4.63-5.282l2.654.592C67.228 21.507 64.71 24 61.564 24c-2.158 0-3.867-1.521-3.732-3.507Z"></path>
          <path fill="#5653FE" d="m77.755 16.69-2.653-.592c-.584 1.648-1.664 2.831-3.147 3.803-1.799-3.084-3.912-4.986-3.418-6.422.27-.888 1.215-1.226 1.98-.972.674.211.898.93.898 1.14l2.248-.802c-.045-.465-.27-1.141-.674-1.69-.675-.888-1.798-1.353-3.012-1.353-2.204 0-3.688 1.226-4.182 3-.9 3.296 2.203 5.79 3.732 8.41-.72.337-1.53.675-2.338 1.013-3.957 1.648-4.856 3.465-4.496 5.07.36 1.522 1.933 2.705 4.091 2.705 3.732 0 7.149-3.38 6.205-7.606 1.798-1.183 3.687-2.62 4.766-5.704ZM67.234 27.38c-.9.17-1.574-.042-1.664-.507-.09-.38.09-1.014 1.844-1.859.989-.465 1.933-.845 2.877-1.226-.045 2.198-2.113 3.423-3.057 3.592Z"></path>
          <path fill="#5653FE" d="M74.393 22.352c-.404-.845-.54-2.282.045-4.268l2.293-7.943h3.013l-2.518 8.83c-.36 1.226-.54 2.24.044 2.451.81.296 2.474-1.52 3.823-5.323l2.652.591C82.216 20.873 80.283 24 77.046 24c-1.304 0-2.293-.887-2.653-1.648ZM79.069 5.07c1.034 0 1.664.676 1.664 1.563 0 .888-.72 1.606-1.664 1.606s-1.708-.718-1.708-1.606c0-.887.764-1.563 1.708-1.563Z"></path>
          <path fill="#5653FE" d="M91.516 19.267c-1.26 2.62-3.418 4.733-6.34 4.733-4.137 0-5.081-4.352-4.407-7.31.675-2.916 1.844-5.113 2.833-6.55h3.102c-1.124 1.69-2.383 4.268-2.922 6.465-.63 2.536-.27 4.606 1.259 4.817 1.798.254 3.641-1.774 4.361-5.197.315-1.521.45-3.38.315-5.028l2.832-1.057c0 2.705-.18 7.606 2.024 7.564.81 0 1.393-.718 1.664-1.606l2.652.592c-1.214 3.296-3.192 3.718-4.496 3.718-1.034 0-2.518-.676-2.877-1.14Z"></path>
        </svg>

        {/* GET MY PLAN button */}
        <button
          onClick={handleGetPlan}
          className="bg-[#5653FE] text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#4442D9] transition-all"
        >
          GET MY PLAN
        </button>
      </nav>

      {/* Main Content - Scrollable */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Section 1: Now vs Goal Comparison */}
        <section className="bg-gray-100 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* NOW */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#24234C] mb-6">Now</h3>
              <div className="relative mb-6">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/male-1.webp"
                  alt="Before"
                  className="w-64 h-64 mx-auto object-contain"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#24234C] mb-2">AI skills</h4>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="40"
                    className="w-full accent-yellow-500"
                    readOnly
                  />
                  <p className="mt-2 text-base font-semibold text-[#374151] bg-gray-300 inline-block px-4 py-2 rounded-lg">
                    Moderate
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#24234C] mb-2">Practical Readiness</h4>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="35"
                    className="w-full accent-blue-500"
                    readOnly
                  />
                  <p className="mt-2 text-base font-semibold text-[#374151] bg-gray-300 inline-block px-4 py-2 rounded-lg">
                    Limited
                  </p>
                </div>
              </div>
            </div>

            {/* GOAL */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#24234C] mb-6">Goal</h3>
              <div className="relative mb-6">
                <img
                  src="https://d3kigabz1zn79w.cloudfront.net/male-1.webp"
                  alt="After"
                  className="w-64 h-64 mx-auto object-contain"
                />
                {/* Percentage badges */}
                <div className="absolute top-10 right-10 bg-[#00D392] text-white rounded-full px-3 py-1 text-sm font-bold">+45%</div>
                <div className="absolute top-24 right-16 bg-[#00D392] text-white rounded-full px-3 py-1 text-sm font-bold">+15%</div>
                <div className="absolute top-36 right-8 bg-[#00D392] text-white rounded-full px-3 py-1 text-sm font-bold">+72%</div>
                <div className="absolute bottom-20 right-12 bg-[#00D392] text-white rounded-full px-3 py-1 text-sm font-bold">+35%</div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#24234C] mb-2">AI skills</h4>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="85"
                    className="w-full accent-green-500"
                    readOnly
                  />
                  <p className="mt-2 text-base font-semibold text-[#374151] bg-gray-300 inline-block px-4 py-2 rounded-lg">
                    High
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#24234C] mb-2">Practical Readiness</h4>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="85"
                    className="w-full accent-blue-600"
                    readOnly
                  />
                  <p className="mt-2 text-base font-semibold text-[#374151] bg-gray-300 inline-block px-4 py-2 rounded-lg">
                    High
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">This is not a guarantee or promise of results.</p>
        </section>

        {/* Section 2: AI is easier than you think */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1E1B4B] mb-12">
            AI is easier than you think
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
                <div className="text-4xl">🚢</div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Day 1</p>
                  <p className="text-lg font-bold text-[#24234C]">Images</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
                <div className="text-4xl">🌀</div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Day 2</p>
                  <p className="text-lg font-bold text-[#24234C]">Writing</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
                <div className="text-4xl">🎙️</div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Day 3</p>
                  <p className="text-lg font-bold text-[#24234C]">Speech</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">👌</span>
                <p className="text-lg text-gray-700">No prior AI knowledge is required</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl">👌</span>
                <p className="text-lg text-gray-700">No need for a university degree</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl">👌</span>
                <p className="text-lg text-gray-700">Work at your own pace and terms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Try Coursiv benefits */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1E1B4B] mb-12">
            Try Coursiv and you will:
          </h2>
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#5653FE]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <p className="text-lg text-gray-700">Master AI tools that can boost your income</p>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#5653FE]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <p className="text-lg text-gray-700">Discover new professions and income sources with AI</p>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#5653FE]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <p className="text-lg text-gray-700">Learn key AI terms and lessons</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <div className="text-[#5653FE] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-1">Your goal</p>
              <p className="text-xl font-bold text-[#24234C]">Gain financial skills</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <div className="text-[#5653FE] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-1">Your target</p>
              <p className="text-xl font-bold text-[#24234C]">Saving for a home</p>
            </div>
          </div>
        </section>

        {/* Section 4: Daily Tools Grid */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { day: 1, name: 'ChatGPT', icon: '🌀', color: 'bg-emerald-500' },
              { day: 2, name: 'Jasper', icon: '✨', color: 'bg-orange-500' },
              { day: 3, name: 'Canva', icon: '🎨', color: 'bg-blue-500' },
              { day: 4, name: 'Midjourney', icon: '🚢', color: 'bg-gray-400' },
              { day: 5, name: 'Synthesia', icon: '💎', color: 'bg-cyan-500' },
              { day: 6, name: 'Lumen5', icon: '🤖', color: 'bg-purple-400' },
              { day: 7, name: 'Copy.ai', icon: '📝', color: 'bg-teal-400' },
              { day: 8, name: 'Descript', icon: '🎙️', color: 'bg-blue-600' },
              { day: 9, name: 'Octopus', icon: '🐙', color: 'bg-purple-600' },
              { day: 10, name: 'Quillbot', icon: '✍️', color: 'bg-teal-300' },
            ].map((tool) => (
              <div key={tool.day} className={`${tool.color} rounded-2xl p-4 text-center text-white`}>
                <div className="text-3xl mb-2">{tool.icon}</div>
                <p className="text-sm font-bold">DAY {tool.day}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xl font-bold text-[#24234C] mb-2">
            203 people purchased personal AI-learning plans in the last hour
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>sarah.da*** 4-week plan</span>
            <span>david.ma*** 12-week plan</span>
            <span>michael.ha*** 4-week</span>
          </div>
        </section>

        {/* Section 5: Pricing Plans */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1E1B4B] mb-12">
            Choose the best plan for you
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 1-Week Plan */}
            <motion.div
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('1-week')}
            >
              <h3 className="text-xl font-bold text-gray-500 mb-2">1-WEEK PLAN</h3>
              <p className="text-3xl font-bold text-[#24234C] mb-4">€13.86</p>
              <p className="text-4xl font-bold text-[#24234C] mb-1">€1.98 <span className="text-base font-normal text-gray-600">per day</span></p>
            </motion.div>

            {/* 4-Week Plan - MOST POPULAR */}
            <motion.div
              className="bg-white border-4 border-[#5653FE] rounded-2xl p-6 cursor-pointer shadow-lg relative"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('4-week')}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#5653FE] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <span>👍</span> MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#24234C] mb-2 mt-2">4-WEEK PLAN</h3>
              <p className="text-3xl font-bold text-[#24234C] mb-4">€39.99</p>
              <p className="text-4xl font-bold text-[#24234C] mb-1">€1.43 <span className="text-base font-normal text-gray-600">per day</span></p>
            </motion.div>

            {/* 12-Week Plan */}
            <motion.div
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlan('12-week')}
            >
              <h3 className="text-xl font-bold text-gray-500 mb-2">12-WEEK PLAN</h3>
              <p className="text-3xl font-bold text-[#24234C] mb-4">€79.99</p>
              <p className="text-4xl font-bold text-[#24234C] mb-1">€0.95 <span className="text-base font-normal text-gray-600">per day</span></p>
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-6 h-6 text-[#5653FE]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <p className="text-gray-700">
                People using plan for 3 months achieve twice as many results as for 1 month
              </p>
            </div>
            <p className="text-sm text-gray-500">*According to a research by Coursiv, 2023</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 max-w-3xl mx-auto mb-8">
            <p className="text-sm text-gray-600 text-center">
              By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 4 weeks at
              €39.99, then €39.99 every 4 weeks (both excluding taxes) until you cancel. You can cancel
              anytime via support or account settings. See <a href="#" className="text-[#5653FE] underline">Subscription Terms</a> for details.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleGetPlan}
              className="bg-[#5653FE] text-white px-16 py-5 rounded-xl text-xl font-bold uppercase tracking-wide hover:bg-[#4442D9] transition-all shadow-lg hover:shadow-2xl"
            >
              GET MY PLAN
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
