'use client'

export default function AIEasierSection() {
  return (
    <div className="investing-condition-section">
      <p className="text-2xl font-semibold tablet:text-3xl laptop:text-4xl text-center mb-6">
        AI is easier than you think
      </p>

      <div className="mx-auto tablet:max-w-[580px] laptop:flex laptop:max-w-[900px] laptop:py-6">
        <div className="my-[24px] flex flex-grow items-center laptop:gap-8 justify-center">
          <div className="relative flex items-center justify-center">
            <img
              alt="AI is easier"
              fetchPriority="high"
              width={150}
              height={210}
              decoding="async"
              className="h-[210px] w-[150px] object-cover laptop:h-[280px] laptop:w-[200px]"
              src="https://d3kigabz1zn79w.cloudfront.net/ai is easier.webp"
              style={{ color: 'transparent' }}
            />
          </div>
          <img
            alt="Daily challenge"
            fetchPriority="high"
            width={150}
            height={210}
            decoding="async"
            className="h-[210px] w-[150px] laptop:h-[280px] laptop:w-[200px]"
            src="https://d3kigabz1zn79w.cloudfront.net/migrated_d14fbcf1p6wyzn_funnel-images_c13_v3_adigp_nt_selling-page_daily-challenge_1.webp"
            style={{ color: 'transparent' }}
          />
        </div>
        <div className="flex-grow laptop:flex laptop:flex-col laptop:items-center laptop:justify-center laptop:gap-4">
          <div className="my-[4px] flex items-center text-center justify-center laptop:justify-start">
            <p className="text-sm font-medium laptop:text-lg flex items-center">
              <img
                src="https://d3kigabz1zn79w.cloudfront.net/investingcondition_emoji-6.webp"
                className="mr-4 inline h-[34px] object-cover"
                alt=""
                height={34}
                width={24}
              />
              No prior AI knowledge is required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
