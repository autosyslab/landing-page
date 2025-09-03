"use client"

import React from "react";
import { content } from "../content"
import RobotCanvas from "./RobotCanvas"

export default function Hero() {
  const H = content.hero

  return (
    <section
      className="
        relative isolate overflow-hidden text-white
        bg-gradient-to-b from-[#032b3a] via-[#039cd0] to-[#00d7ea]
      "
      aria-labelledby="hero-heading"
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

            <h1 
              id="hero-heading"
              className="mt-8 leading-[1.1] font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
              role="heading"
              aria-level={1}
            >
              <span className="block">Meet Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-cyan-200">
                First AI
              </span>
              <span className="block">Employee</span>
            </h1>

            <div className="mt-8 space-y-4 text-white/90 text-lg leading-relaxed max-w-xl" role="region" aria-label="Hero description">
              <p className="font-medium">{H.body1}</p>
              <p className="text-white/75">{H.body2}</p>
            </div>

            <div className="mt-12">
              <a
                href="#roi"
                role="button"
                aria-describedby="cta-caption"
                className="
                  inline-flex items-center rounded-2xl px-8 py-4
                  font-bold text-slate-900 text-lg
                  bg-gradient-to-r from-[#59def2] to-[#6ee7f5] hover:from-[#6ee7f5] hover:to-[#7debf7]
                  shadow-[0_10px_30px_rgba(89,222,242,0.4)] hover:shadow-[0_15px_35px_rgba(89,222,242,0.5)]
                  transform hover:scale-105 transition-all duration-200
                  ring-1 ring-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                "
              >
                {H.cta}
              </a>
              <div id="cta-caption" className="mt-4 text-sm text-white/60 font-medium">{H.caption}</div>
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