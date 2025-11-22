'use client'

export default function PaymentSection() {
  return (
    <div className="payment-section px-6">
      {/* Payment Form Container */}
      <div className="flex min-h-[196px] w-full flex-row items-center justify-center" style={{ minHeight: '0px', padding: '16px 0px 4px' }}>
        <div className="flex w-full flex-col gap-4">
          <div id="card-form-wrapper" className="">
            <div id="solid-payment-form-container_#123" className="sc-aXZVg dRTSQr">
              <iframe
                id="solid-payment-form-iframe"
                name="solid-payment-form-iframe"
                allow="payment *"
                src="https://form-v2.solidgate.com/version/payment-form-v1.292.0"
                data-payment-type="payment"
                style={{
                  transition: 'none',
                  opacity: 0,
                  position: 'absolute',
                  height: '0px',
                  minHeight: '120px',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Terms */}
      <p className="px-1 pb-3 text-center text-xs leading-snug text-secondary mt-4">
        You agree that <b>€39.99</b> will be as an intro offer, then <b>€39.99</b> will be automatically billed every 1 month until you cancel in settings.{' '}
        <a className="underline" href="https://legal.coursiv.io/en/subscription" target="_blank" rel="noreferrer">
          Subscription Terms.
        </a>
      </p>
    </div>
  )
}
