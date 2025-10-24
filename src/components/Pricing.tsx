import { content } from "../content";
import clsx from "clsx";
import React from 'react';
import { Lock, FileText, Play, Zap, Settings, TrendingUp, Sparkles } from 'lucide-react';

function Pricing(){
  const { heading, sub, tiers } = content.pricing;
  const data = [tiers.starter, tiers.growth, tiers.elite] as const;

  return (
    <section className="relative overflow-hidden text-white">
      {/* AI Circuit Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #00d4ff 1px, transparent 1px),
            linear-gradient(0deg, #00d4ff 1px, transparent 1px),
            radial-gradient(circle at 20% 20%, #00d4ff 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, #0088cc 1px, transparent 1px),
            radial-gradient(circle at 40% 60%, #00aaee 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 100px 100px, 150px 150px, 200px 200px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0'
        }}
      />
      
      {/* Neural Network Nodes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00d4ff]" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse shadow-[0_0_8px_#0088cc]" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_6px_#00aaee]" />
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse shadow-[0_0_4px_#0099dd]" />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_6px_#00bbff]" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse shadow-[0_0_8px_#0077bb]" />
        
        {/* Circuit Traces */}
        <div className="absolute top-12 left-12 w-20 h-px bg-gradient-to-r from-cyan-400 to-transparent animate-pulse" />
        <div className="absolute top-22 right-22 w-16 h-px bg-gradient-to-l from-blue-300 to-transparent animate-pulse" />
        <div className="absolute bottom-22 left-22 w-24 h-px bg-gradient-to-r from-cyan-300 to-transparent animate-pulse" />
      </div>
      
      {/* Floating Data Streams */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 animate-[slideRight_8s_linear_infinite]" />
        <div className="absolute top-32 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-300 to-transparent opacity-30 animate-[slideLeft_6s_linear_infinite]" />
        <div className="absolute bottom-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-25 animate-[slideRight_10s_linear_infinite]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-200 drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
            {heading}
          </h2>
          <p className="mt-3 text-slate-300 drop-shadow-lg">{sub}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {data.map((t, i) => {
            const popular = t === tiers.growth;
            return (
              <div key={t.name} className={clsx(
                "relative rounded-3xl p-4 sm:p-6 md:p-8 border backdrop-blur-lg overflow-hidden group hover:scale-105 transition-all duration-300",
                "flex flex-col min-h-[500px]", // Ensure equal height and flexbox layout
                popular
                  ? "border-blue-400/60 bg-gradient-to-b from-blue-600/30 to-indigo-600/20 shadow-[0_10px_40px_rgba(0,212,255,0.4)] hover:shadow-[0_20px_60px_rgba(0,212,255,0.6)]"
                  : "border-cyan-400/30 bg-gradient-to-b from-slate-800/50 to-slate-900/30 hover:border-cyan-400/50 shadow-[0_10px_30px_rgba(0,170,238,0.2)] hover:shadow-[0_15px_45px_rgba(0,170,238,0.4)]"
              )}>
                {/* Card Circuit Glow */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                  <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                </div>
                
                {/* Corner Circuit Nodes */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col h-full">
                {("badge" in t) && (<div className="mb-3 inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-300/30">{(t as any).badge}</div>)}
                <h3 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">{t.name}</h3>
                <p className="mt-1 text-cyan-300 drop-shadow-sm">{t.tag}</p>
                <ul className="mt-6 space-y-3 text-slate-200 flex-1">
                  {t.bullets.map(b => <li key={b} className="flex gap-2"><span className="text-cyan-400 drop-shadow-[0_0_4px_rgba(0,212,255,0.8)]">✔︎</span><span>{b}</span></li>)}
                </ul>
                <div className="mt-auto pt-6">
                  <a 
                    href="https://cal.com/iulian-boamfa-rjnurb/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      "w-full inline-flex justify-center items-center px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transform hover:scale-105",
                    popular
                      ? "bg-gradient-to-r from-blue-500 to-violet-500 text-slate-900 ring-blue-300 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 hover:from-cyan-400 hover:to-blue-400 ring-cyan-300 shadow-[0_0_15px_rgba(0,212,255,0.5)] hover:shadow-[0_0_25px_rgba(0,212,255,0.8)]"
                    )}
                  >
                    {getCTAText(t.name)}
                  </a>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* AutoSysLab Vault Section - Integrated */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Centered Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-200 drop-shadow-[0_0_30px_rgba(0,212,255,0.6)] leading-tight">
            AutoSysLab Vault
          </h2>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-cyan-300/90 drop-shadow-lg">
            Ready-Made Automations at Your Fingertips
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Content */}
          <div className="space-y-8">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-xl text-slate-300 leading-relaxed font-medium">
                Why wait weeks to see results when you can start today? The Vault gives you instant access to done-for-you automation systems — battle-tested, packaged, and ready to deploy.
              </p>
            </div>

            {/* Enhanced Feature List - Vertical Layout */}
            <div className="space-y-6">
              <VaultFeature
                icon={<FileText className="w-6 h-6" />}
                text="Step-by-step PDF playbooks that guide you from setup to execution"
              />
              <VaultFeature
                icon={<Play className="w-6 h-6" />}
                text="Recorded installation walkthroughs so you never get stuck"
              />
              <VaultFeature
                icon={<Zap className="w-6 h-6" />}
                text="Proven workflows built on real business use cases"
              />
              <VaultFeature
                icon={<Settings className="w-6 h-6" />}
                text="Scalable designs you can run as-is or customise to your needs"
              />
            </div>

            {/* Enhanced Call-to-Action Box - Positioned at bottom of text content */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border-2 border-cyan-400/40 backdrop-blur-sm shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:shadow-[0_0_40px_rgba(0,212,255,0.3)] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-100 mb-2">Ready to Transform Your Business?</h3>
                  <p className="text-cyan-200 font-medium leading-relaxed">
                    Instead of reinventing the wheel, unlock the exact automations that save time, cut costs, and grow revenue from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vault Visual + Button - Aligned with text content */}
          <div className="relative flex flex-col justify-between min-h-full">
            {/* Vault Visual - Aligned to top of text content */}
            <div className="flex-shrink-0">
              <VaultVisual />
            </div>
            
            {/* Spacer to push button to bottom */}
            <div className="flex-1"></div>
            
            {/* Glowing "Unlock the Vault" Button - Aligned to bottom of text content */}
            <div className="flex-shrink-0 flex justify-center mt-8">
              <a
                href="https://autosyslab.gumroad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center justify-center rounded-2xl px-10 py-5 font-bold text-slate-900 text-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_30px_rgba(0,212,255,0.6),0_0_60px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.8),0_0_80px_rgba(0,212,255,0.4)] transform hover:scale-110 transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50"
              >
                <Lock className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Unlock the Vault</span>
                
                {/* Animated Glow Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pulse Animation */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse blur-md" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Enhanced CTA copy function with action-oriented, compelling text
function getCTAText(tierName: string): string {
  switch (tierName) {
    case 'Starter':
      return 'Launch First Automation →';
    case 'Growth':
      return 'Deploy AI Employee →';
    case 'Elite':
      return 'Build AI Team →';
    default:
      return 'Get Started →';
  }
}

// Vault Feature Component - Enhanced for vertical list layout
function VaultFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-4 group hover:translate-x-1 transition-transform duration-200">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.6)] group-hover:scale-110 transition-all duration-200">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-slate-200 leading-relaxed font-medium text-lg">{text}</p>
      </div>
    </div>
  );
}

// Vault Visual Component - Optimized for top alignment
function VaultVisual() {
  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[450px] flex items-center justify-center">
      {/* Main Vault Container */}
      <div className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(0,212,255,0.3)] overflow-hidden group hover:shadow-[0_0_70px_rgba(0,212,255,0.5)] transition-all duration-500">
        
        {/* Vault Door Effect */}
        <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/60 border border-cyan-300/20 group-hover:border-cyan-300/40 transition-all duration-500">
          
          {/* Central Lock Mechanism */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-24 h-24 rounded-full border-4 border-cyan-400/60 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-6 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-2 shadow-[0_0_10px_#00d4ff]" />
                <div className="absolute bottom-0 left-1/2 w-2 h-6 bg-cyan-400 rounded-full -translate-x-1/2 translate-y-2 shadow-[0_0_10px_#00d4ff]" />
                <div className="absolute left-0 top-1/2 w-6 h-2 bg-cyan-400 rounded-full -translate-x-2 -translate-y-1/2 shadow-[0_0_10px_#00d4ff]" />
                <div className="absolute right-0 top-1/2 w-6 h-2 bg-cyan-400 rounded-full translate-x-2 -translate-y-1/2 shadow-[0_0_10px_#00d4ff]" />
              </div>
              
              {/* Inner Core */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(0,212,255,0.8)] flex items-center justify-center group-hover:animate-pulse">
                <Lock className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          {/* Corner Circuit Nodes */}
          <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00d4ff]" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00d4ff]" />
          <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00d4ff]" />
          <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00d4ff]" />
        </div>
        
        {/* Floating Automation Icons */}
        <div className="absolute -top-8 -right-8 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg animate-float">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        
        <div className="absolute -bottom-6 -left-6 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
          <Zap className="w-5 h-5 text-white" />
        </div>
        
        <div className="absolute top-1/4 -left-10 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '2s' }}>
          <FileText className="w-4 h-4 text-white" />
        </div>
      </div>
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
    </div>
  );
}

export default Pricing;