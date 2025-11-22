'use client'

import { useState } from 'react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: {
    name: string
    price: string
    pricePerDay: string
  }
}

export default function CheckoutModal({ isOpen, onClose, selectedPlan }: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  if (!isOpen) return null

  const basePrice = 39.99
  const vat = 9.20
  const total = 49.19

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[1300]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[1301] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#24234C] mb-2">
                Join over <span className="text-[#5653FE]">700,000 users</span> to achieve your goals
              </h2>
            </div>

            {/* Safe Checkout Title */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#24234C]">Safe checkout</h3>
            </div>

            {/* Order Summary */}
            <div className="py-6 border-t border-b border-gray-200">
              {/* Product Line */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-base text-gray-600">AI-Driven Income Challenge</span>
                <span className="text-base font-semibold text-[#24234C]">€{basePrice.toFixed(2)}</span>
              </div>

              {/* Divider */}
              <div className="pb-2"></div>
              <hr className="mb-2 bg-[#E5E7EB]" />

              {/* Total */}
              <div className="flex items-center justify-between text-base font-bold leading-normal text-[#24234C] mb-1">
                <span>Total</span>
                <span className="text-2xl">€{total.toFixed(2)}</span>
              </div>

              {/* VAT breakdown */}
              <p className="text-end text-[10px] text-[#6B7280] mb-1">
                €{basePrice.toFixed(2)} + €{vat.toFixed(2)} VAT
              </p>
            </div>

            {/* PayPal Button */}
            <button className="w-full bg-[#FFC439] hover:bg-[#FFB800] text-black font-bold py-4 rounded-lg mb-4 mt-6 flex items-center justify-center gap-2 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.905 9.5c.21 1.42-.03 2.39-.76 3.35-.99 1.31-2.81 2.03-4.96 2.03h-.52c-.36 0-.67.26-.73.62l-.04.18-.67 4.25-.03.16c-.06.36-.37.62-.73.62H9.82c-.42 0-.73-.36-.66-.77l1.99-12.6c.06-.36.37-.62.73-.62h4.42c1.58 0 2.7.33 3.52.99.33.27.59.58.79.92.35.61.54 1.35.54 2.24 0 .21-.01.42-.03.64z" fill="#003087"/>
                <path d="M21.48 9.88c-.07.45-.17.87-.31 1.27-.99 2.84-3.52 3.83-7 3.83h-1.77c-.43 0-.8.31-.87.73l-.93 5.88-.26 1.67c-.07.42.24.79.66.79h4.64c.38 0 .7-.28.76-.65l.03-.16.6-3.81.04-.2c.06-.37.38-.65.76-.65h.48c3.02 0 5.38-1.22 6.07-4.76.29-1.48.14-2.71-.58-3.57-.21-.25-.47-.47-.77-.65-.05.22-.12.43-.2.64z" fill="#0070E0"/>
                <path d="M8.61 9.88c.06-.37.37-.65.76-.65h6.32c.74 0 1.43.05 2.06.16.18.03.36.07.53.11.17.04.34.09.5.15.08.03.16.05.24.08.29.1.57.22.83.36.3-1.92-.03-3.22-1.18-4.52C17.33 4.17 15.26 3.5 12.61 3.5H5.94c-.43 0-.8.31-.87.73L2 21.07c-.08.49.28.93.77.93h5.61l1.41-8.93-.18 1.18z" fill="#003087"/>
              </svg>
              <span className="font-bold">Buy Now</span>
            </button>

            {/* Card Payment Form */}
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#5653FE] focus:border-transparent"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#5653FE] focus:border-transparent"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#5653FE] focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="CVV help"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Payment Button */}
              <button className="w-full bg-[#5653FE] hover:bg-[#4442D9] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="uppercase tracking-wide">CONFIRM PAYMENT</span>
              </button>

              {/* Terms */}
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>
                  You agree that <span className="font-semibold">€{basePrice.toFixed(2)}</span> will be as an intro offer, then{' '}
                  <span className="font-semibold">€{basePrice.toFixed(2)}</span> will be automatically billed every 1 month until
                  you cancel in settings.{' '}
                  <a href="#" className="text-[#5653FE] underline hover:text-[#4442D9]">
                    Subscription Terms.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
