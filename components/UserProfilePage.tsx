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
