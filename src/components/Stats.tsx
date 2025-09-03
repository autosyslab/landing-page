import { content } from "../content";

export default function Stats(){
  const S = content.stats;
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 via-slate-200 via-slate-400 via-slate-700 via-slate-800 to-[#071420] text-white">
    <section className="bg-gradient-to-b from-slate-400 via-slate-600 via-slate-700 via-slate-800 to-[#0b1320] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold">{S.heading}</h2>
          <p className="mt-3 text-slate-300">{S.sub}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {S.items.map(item => (
            <div key={item.pct} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-5xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] text-cyan-300">{item.pct}</div>
              <div className="mt-3 text-slate-300">{item.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-cyan-300/80 text-sm">⚡ {S.micro}</div>
        <div className="mt-6 text-center">
          <a 
            href="https://cal.com/iulian-boamfa-rjnurb/30min" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl px-6 py-3 font-medium bg-gradient-to-r from-orange-500 to-pink-500 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            {S.cta}
          </a>
        </div>
      </div>
    </section>
    </section>
  );
}