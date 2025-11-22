'use client'

export default function ReadinessBlockSection() {
  return (
    <div id="readinessBlock">
      <div className="mx-auto max-w-[400px] px-4 tablet:max-w-[580px] laptop:px-0">
        <p className="mb-[12px] text-lg font-bold">
          <span className="text-main">Your readiness:&nbsp;</span>
          <span className="text-readiness-score">83%</span>
        </p>
        <div className="flex items-center justify-center rounded-lg border border-sp-accent bg-secondary px-[16px] py-[24px]">
          <p className="mr-[4px] font-medium text-secondary">
            <span className="text-[#7ABF4C]">4-week</span> program is enough for you to start your AI journey
          </p>
          <img
            alt=""
            loading="lazy"
            width={32}
            height={37}
            decoding="async"
            src="https://d3kigabz1zn79w.cloudfront.net/migrated_d14fbcf1p6wyzn_funnel-images_c13_v3_adigp_nt_readiness-block_lightbulb.webp"
            style={{ color: 'transparent', width: '32px', height: '37px' }}
          />
        </div>
      </div>
    </div>
  )
}
