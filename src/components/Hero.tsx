"use client"

import { content } from "../content"
import RobotCanvas from "./RobotCanvas"
import VapiWidget from "./VapiWidget"

export default function Hero() {
  const H = content.hero

  return (
    <section
      className="
        relative isolate overflow-hidden text-white
        bg-gradient-to-b from-[#032b3a] via-[#039cd0] to-[#00d7ea]
      "
    >
      {/* LEFT translucent panel (slightly more transparent) */}
      <div
        aria-hidden
        className="
          absolute left-4 top-6 bottom-8
          w-[720px] max-w-[92%]
          rounded-lg
          bg-[#032b3a]/16 backdrop-blur-sm
          shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          z-0
        "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COPY */}
          <div className="max-w-2xl">
            <p className="text-cyan-100/90 text-sm font-medium tracking-wider uppercase">{H.eyebrow}</p>

            <h1 className="mt-8 leading-[1.1] font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
              <span className="block">Meet Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-cyan-200">
                First AI
              </span>
              <span className="block">Employee</span>
            </h1>

            <div className="mt-8 space-y-4 text-white/90 text-lg leading-relaxed max-w-xl">
              <p className="font-medium">{H.body1}</p>
              <p className="text-white/75">{H.body2}</p>
            </div>

            <div className="mt-12">
              <VapiWidget
                apiKey="044b074b-c5e2-4194-b654-37941f249593"
                assistantId="895bfd75-95b3-49f8-a0a6-bbb60a53ef45"
              />
              <div className="mt-4 text-sm text-white/60 font-medium">{H.caption}</div>
            </div>
          </div>

          {/* RIGHT: Robot + glow (replaces "Robot preview") */}
          <RobotCanvas />
        </div>
      </div>

      {/* Subtle top/bottom hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" aria-hidden />
    </section>
  )
}