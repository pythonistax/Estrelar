'use client'

import { motion } from 'framer-motion'
import { copy } from '@/lib/config'

interface UserProfilePageProps {
  onContinue: () => void
  onBack?: () => void
}

export default function UserProfilePage({ onContinue, onBack }: UserProfilePageProps) {
  const profile = copy.userProfile

  return (
    <div className="relative min-h-screen overflow-x-hidden contents">
      <div className="relative z-10 mx-auto flex h-full min-h-full w-full max-w-[400px] flex-col tablet:max-w-full pb-[104px] gap-2">
        {/* Header */}
        <div className="">
          <div className="relative flex h-12 w-full flex-row items-center justify-end border-b-2 border-secondary px-4 py-2 tablet:h-16">
            <div className="absolute left-1/2 -translate-x-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="139" height="50" viewBox="0 -5 139 55">
                <defs>
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}
                  </style>
                </defs>
                <text 
                  x="0" 
                  y="35" 
                  fontFamily="Pacifico, cursive" 
                  fontSize="28" 
                  fontWeight="400" 
                  fill="var(--text-accent, #5653FE)"
                  letterSpacing="0.5"
                >
                  28Days
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full w-full">
          <div className="relative flex h-full flex-col tablet:pt-5 laptop:pt-10" style={{ opacity: 1 }}>
            {/* Title */}
            <div className="flex-initial w-full space-y-2 px-4 mx-auto text-center max-w-[400px] laptop:max-w-[560px]">
              <h1 className="text-2xl font-bold leading-9 text-main">{profile.title}</h1>
            </div>

            {/* Profile Card */}
            <div className="w-full flex-1 px-4 pb-[34px]" id="quiz-page">
              <div className="mx-auto mt-4 flex max-w-[400px] flex-col tablet:flex tablet:h-full tablet:flex-row tablet:items-center tablet:justify-center">
                <div className="relative mb-[60px] overflow-hidden rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 12px 0px' }}>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    {/* Readiness Score Header */}
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-main">Readiness score</p>
                      <div className="rounded border px-1.5 text-xs font-medium leading-[21px] text-secondary">
                        Result: Perfect
                      </div>
                    </div>

                    {/* Progress Indicator - Exact SVG from HTML */}
                    <div className="mx-auto max-w-[320px]">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 888 168" width="888" height="168" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)', contentVisibility: 'visible' }}>
                          <defs>
                            <text fontFamily="Inter" fontStyle="normal" fontWeight="normal" style={{ fontSize: '100px', fontFamily: 'Inter' }}>t</text>
                            <clipPath id="__lottie_element_28">
                              <rect width="888" height="168" x="0" y="0"></rect>
                            </clipPath>
                            <linearGradient id="__lottie_element_41" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-443.82598876953125" y1="0" x2="443.2619934082031" y2="0">
                              <stop offset="0%" stopColor="rgb(212,51,51)"></stop>
                              <stop offset="25%" stopColor="rgb(232,141,36)"></stop>
                              <stop offset="50%" stopColor="rgb(252,230,21)"></stop>
                              <stop offset="75%" stopColor="rgb(187,210,48)"></stop>
                              <stop offset="100%" stopColor="rgb(122,191,76)"></stop>
                            </linearGradient>
                          </defs>
                          <g clipPath="url(#__lottie_element_28)">
                            <g transform="matrix(1,0,0,1,-0.25,122.23099517822266)" opacity="1" style={{ display: 'block' }}>
                              <g opacity="1" transform="matrix(1,0,0,1,444.0639953613281,12.25100040435791)">
                                <path fill="url(#__lottie_element_41)" fillOpacity="1" d=" M-432.1860046386719,-12.00100040435791 C-437.7869873046875,-12.00100040435791 -442.4909973144531,-8.163000106811523 -443.8139953613281,-2.9749999046325684 C-443.8139953613281,-2.9749999046325684 -443.8139953613281,2.9749999046325684 -443.8139953613281,2.9749999046325684 C-442.4909973144531,8.163999557495117 -437.7869873046875,12.00100040435791 -432.1860046386719,12.00100040435791 C-432.1860046386719,12.00100040435791 431.8139953613281,12.00100040435791 431.8139953613281,12.00100040435791 C438.4419860839844,12.00100040435791 443.8139953613281,6.626999855041504 443.8139953613281,-0.0010000000474974513 C443.8139953613281,-6.627999782562256 438.4419860839844,-12.00100040435791 431.8139953613281,-12.00100040435791 C431.8139953613281,-12.00100040435791 -432.1860046386719,-12.00100040435791 -432.1860046386719,-12.00100040435791z"></path>
                              </g>
                            </g>
                            <g style={{ display: 'block' }} transform="matrix(1,0,0,1,433.8800048828125,8.229999542236328)" opacity="1">
                              <g opacity="1" transform="matrix(1,0,0,1,144.25,45.25)">
                                <path fill="rgb(64,68,77)" fillOpacity="1" d=" M144,-33 C144,-33 144,15 144,15 C144,21.6299991607666 138.6300048828125,27 132,27 C132,27 21.290000915527344,27 21.290000915527344,27 C21.290000915527344,27 21.5,27.18000030517578 21.5,27.18000030517578 C21.5,27.18000030517578 0.5,45 0.5,45 C0.5,45 -20.5,27.18000030517578 -20.5,27.18000030517578 C-20.5,27.18000030517578 -20.290000915527344,27 -20.290000915527344,27 C-20.290000915527344,27 -132,27 -132,27 C-138.6300048828125,27 -144,21.6299991607666 -144,15 C-144,15 -144,-33 -144,-33 C-144,-39.619998931884766 -138.6300048828125,-45 -132,-45 C-132,-45 132,-45 132,-45 C138.6300048828125,-45 144,-39.619998931884766 144,-33z"></path>
                              </g>
                            </g>
                            <g style={{ display: 'block' }} transform="matrix(1,0,0,1,576.5,57)" opacity="1" fill="rgb(235,235,235)" fontSize="36" fontFamily="Inter" fontStyle="normal" fontWeight="normal" aria-label="Moderate">
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,-69.00621032714844,0)" opacity="1" style={{ display: 'inherit' }}>M</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,-36.983131408691406,0)" opacity="1" style={{ display: 'inherit' }}>o</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,-18.971277236938477,0)" opacity="1" style={{ display: 'inherit' }}>d</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,-0.9594252109527588,0)" opacity="1" style={{ display: 'inherit' }}>e</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,15.024957656860352,0)" opacity="1" style={{ display: 'inherit' }}>r</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,27.026830673217773,0)" opacity="1" style={{ display: 'inherit' }}>a</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,43.01121520996094,0)" opacity="1" style={{ display: 'inherit' }}>t</text>
                              <text strokeLinecap="butt" strokeLinejoin="round" strokeMiterlimit="4" xmlSpace="preserve" transform="matrix(1,0,0,1,53.021827697753906,0)" opacity="1" style={{ display: 'inherit' }}>e</text>
                            </g>
                            <motion.g
                              initial={{ x: -400, y: 104.22999572753906 }}
                              animate={{ x: 548.3759765625, y: 104.22999572753906 }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              style={{ display: 'block', opacity: 1 }}
                            >
                              <g opacity="1" transform="matrix(1,0,0,1,30.25200080871582,30.25200080871582)">
                                <path fill="rgb(255,255,255)" fillOpacity="1" d=" M0,-30 C16.569000244140625,-30 30,-16.569000244140625 30,0 C30,16.569000244140625 16.569000244140625,30 0,30 C-16.569000244140625,30 -30,16.569000244140625 -30,0 C-30,-16.569000244140625 -16.569000244140625,-30 0,-30z"></path>
                              </g>
                              <g opacity="1" transform="matrix(1,0,0,1,30.25200080871582,30.25200080871582)">
                                <path fill="rgb(196,199,204)" fillOpacity="1" d=" M0,-25.5 C0,-25.5 0,-21 0,-21 C5.813000202178955,-20.99799919128418 11.03499984741211,-18.656999588012695 14.848999977111816,-14.848999977111816 C18.6560001373291,-11.03499984741211 20.99799919128418,-5.813000202178955 21,0 C20.99799919128418,5.813000202178955 18.6560001373291,11.03499984741211 14.848999977111816,14.848999977111816 C11.03499984741211,18.656999588012695 5.813000202178955,20.99799919128418 0,21 C-5.813000202178955,20.99799919128418 -11.03499984741211,18.656999588012695 -14.848999977111816,14.848999977111816 C-18.6560001373291,11.03499984741211 -20.99799919128418,5.813000202178955 -21,0 C-20.99799919128418,-5.813000202178955 -18.6560001373291,-11.03499984741211 -14.848999977111816,-14.848999977111816 C-11.03499984741211,-18.656999588012695 -5.813000202178955,-20.99799919128418 0,-21 C0,-21 0,-25.5 0,-25.5 C0,-25.5 0,-30 0,-30 C-8.270000457763672,-30.00200080871582 -15.79800033569336,-26.635000228881836 -21.21299934387207,-21.21299934387207 C-26.635000228881836,-15.79800033569336 -30.00200080871582,-8.270000457763672 -30,0 C-30.00200080871582,8.270000457763672 -26.635000228881836,15.79800033569336 -21.21299934387207,21.21299934387207 C-15.79800033569336,26.635000228881836 -8.270000457763672,30.00200080871582 0,30 C8.270000457763672,30.00200080871582 15.79800033569336,26.635000228881836 21.21299934387207,21.21299934387207 C26.635000228881836,15.79800033569336 30.00200080871582,8.270000457763672 30,0 C30.00200080871582,-8.270000457763672 26.635000228881836,-15.79800033569336 21.21299934387207,-21.21299934387207 C15.79800033569336,-26.635000228881836 8.270000457763672,-30.00200080871582 0,-30 C0,-30 0,-25.5 0,-25.5z"></path>
                              </g>
                            </motion.g>
                          </g>
                        </svg>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2px] text-main">
                        <p>Low</p>
                        <p>Intermediate</p>
                        <p>High</p>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="flex gap-2 rounded-lg bg-secondary py-2 px-2">
                      <div className="h-6 w-6 text-xl">👍</div>
                      <div>
                        <p className="mb-0.5 text-[10px] font-bold leading-4 text-main">{profile.support.title}</p>
                        <p className="text-[10px] leading-[15px] text-main">{profile.support.description}</p>
                      </div>
                    </div>

                    {/* Profile Metrics */}
                    <div className="flex items-center">
                      <motion.div
                        className="flex flex-col gap-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.15,
                            },
                          },
                        }}
                      >
                        {profile.metrics.map((metric, index) => (
                          <motion.div
                            key={index}
                            className="flex gap-2"
                            variants={{
                              hidden: { opacity: 0, x: -50 },
                              visible: { opacity: 1, x: 0 },
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          >
                            <div className="h-8 w-8 rounded-md bg-slate-100 p-2">
                              <img src={metric.icon} alt={metric.title} />
                            </div>
                            <div>
                              <p className="text-[10px] font-medium text-main">{metric.title}</p>
                              <p className="text-xs font-bold text-main">{metric.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                      {/* Background Image */}
                      <motion.div
                        className="flex h-[148px] flex-1 items-center justify-end"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      >
                        <img className="w-[148px]" src={profile.backgroundImage} alt="" />
                      </motion.div>
                    </div>
                  </div>
                  {/* Decorative SVG Element */}
                  <div className="absolute -right-7 bottom-0 -z-10">
                    <div style={{ height: '160px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 800" width="400" height="800" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)', contentVisibility: 'visible' }}>
                        <defs>
                          <clipPath id="__lottie_element_43">
                            <rect width="400" height="800" x="0" y="0"></rect>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#__lottie_element_43)">
                          <g style={{ display: 'block' }} transform="matrix(1,0,0,1,-5.7989959716796875,28.621002197265625)" opacity="0.36076053333332975">
                            <g opacity="1" transform="matrix(1,0,0,1,129.3509979248047,371.0780029296875)">
                              <path fill="rgb(86,83,254)" fillOpacity="1" d=" M123.552001953125,-357.3840026855469 C123.552001953125,-357.3840026855469 -84.51000213623047,-47.05400085449219 -84.51000213623047,-47.05400085449219 C-103.59600067138672,-18.586999893188477 -103.59600067138672,18.58799934387207 -84.51000213623047,47.053001403808594 C-84.51000213623047,47.053001403808594 123.552001953125,357.385009765625 123.552001953125,357.385009765625 C123.552001953125,357.385009765625 103.5,370.8280029296875 103.5,370.8280029296875 C103.5,370.8280029296875 -104.56300354003906,60.5 -104.56300354003906,60.5 C-129.1009979248047,23.89900016784668 -129.1009979248047,-23.898000717163086 -104.56199645996094,-60.49800109863281 C-104.56199645996094,-60.49800109863281 103.5,-370.8280029296875 103.5,-370.8280029296875 C103.5,-370.8280029296875 123.552001953125,-357.3840026855469 123.552001953125,-357.3840026855469z"></path>
                            </g>
                          </g>
                          <g style={{ display: 'block' }} transform="matrix(1,0,0,1,70.6500015258789,28.621002197265625)" opacity="0.4">
                            <g opacity="1" transform="matrix(1,0,0,1,126.57599639892578,371.0780029296875)">
                              <path fill="rgb(86,83,254)" fillOpacity="1" d=" M126.3270034790039,-357.3840026855469 C126.3270034790039,-357.3840026855469 -81.73600006103516,-47.05400085449219 -81.73600006103516,-47.05400085449219 C-100.8219985961914,-18.586999893188477 -100.8219985961914,18.58799934387207 -81.73600006103516,47.053001403808594 C-81.73600006103516,47.053001403808594 126.3270034790039,357.385009765625 126.3270034790039,357.385009765625 C126.3270034790039,357.385009765625 106.2750015258789,370.8280029296875 106.2750015258789,370.8280029296875 C106.2750015258789,370.8280029296875 -101.78900146484375,60.5 -101.78900146484375,60.5 C-126.3270034790039,23.89900016784668 -126.3270034790039,-23.898000717163086 -101.78800201416016,-60.49800109863281 C-101.78800201416016,-60.49800109863281 106.2750015258789,-370.8280029296875 106.2750015258789,-370.8280029296875 C106.2750015258789,-370.8280029296875 126.3270034790039,-357.3840026855469 126.3270034790039,-357.3840026855469z"></path>
                            </g>
                          </g>
                          <g transform="matrix(1,0,0,1,147.0980224609375,28.621002197265625)" opacity="0.4" style={{ display: 'block' }}>
                            <g opacity="1" transform="matrix(1,0,0,1,126.57599639892578,371.0780029296875)">
                              <path fill="rgb(86,83,254)" fillOpacity="1" d=" M126.32599639892578,-357.3840026855469 C126.32599639892578,-357.3840026855469 -81.73600006103516,-47.05400085449219 -81.73600006103516,-47.05400085449219 C-100.82099914550781,-18.586999893188477 -100.82099914550781,18.58799934387207 -81.73600006103516,47.053001403808594 C-81.73600006103516,47.053001403808594 126.32599639892578,357.385009765625 126.32599639892578,357.385009765625 C126.32599639892578,357.385009765625 106.2760009765625,370.8280029296875 106.2760009765625,370.8280029296875 C106.2760009765625,370.8280029296875 -101.78800201416016,60.5 -101.78800201416016,60.5 C-126.32599639892578,23.89900016784668 -126.32599639892578,-23.898000717163086 -101.78800201416016,-60.49800109863281 C-101.78800201416016,-60.49800109863281 106.2760009765625,-370.8280029296875 106.2760009765625,-370.8280029296875 C106.2760009765625,-370.8280029296875 126.32599639892578,-357.3840026855469 126.32599639892578,-357.3840026855469z"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mx-auto w-full max-w-[400px] fixed bottom-0 left-0 right-0 z-10">
              <div className="flex flex-col px-4 py-6 bg-transparent">
                <button
                  onClick={onContinue}
                  className="relative w-full select-none p-4 transition-all bg-accent-main disabled:bg-accent-secondary rounded-lg"
                  style={{ boxShadow: '0px -6px 10px 12px rgba(86, 83, 254, 0.1)' }}
                  data-cy-id="continue-quiz-button-user-profile"
                  data-testid="continue-quiz-button-user-profile"
                >
                  <span className="text-base font-semibold uppercase text-white">{profile.cta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
