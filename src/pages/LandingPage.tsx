import { Link } from 'react-router-dom';
import { Video, Mic, Upload, Zap, ArrowRight, Play } from 'lucide-react';

const features = [
  { icon: Upload, title: 'Your face, your avatar', desc: 'Upload any photo and turn it into a realistic talking avatar in seconds.' },
  { icon: Mic,    title: 'Choose any voice',        desc: 'Pick from dozens of AI voices across languages, accents, and genders.' },
  { icon: Zap,    title: 'Generate in seconds',     desc: 'Type your script, hit generate — your talking video is ready in under a minute.' },
  { icon: Video,  title: 'Download as MP4',         desc: 'Download your video or share it directly — no watermark on free tier.' },
];

const steps = [
  { n: '01', title: 'Pick an avatar',   desc: 'Upload your own photo or choose from our library of preset AI avatars.' },
  { n: '02', title: 'Type your script', desc: 'Enter what you want your avatar to say — any length, any language.' },
  { n: '03', title: 'Choose a voice',   desc: 'Select from natural-sounding AI voices with different accents and tones.' },
  { n: '04', title: 'Download & share', desc: 'Get your MP4 in seconds. Share it anywhere.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="border-b border-white/10 sticky top-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Talkr</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-400 hover:text-white text-sm transition px-3 py-2">Sign in</Link>
            <Link to="/register" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" /> Powered by D-ID AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
            Turn any photo into a<br />talking avatar video
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload a photo, type your script, choose a voice — and get a professional talking avatar video in seconds. No camera. No recording. No editing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-lg shadow-violet-900/40 text-base">
              Create your first video — free <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition text-base">
              <Play className="w-4 h-4 text-violet-400" /> Watch demo
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-4">No credit card required · 5 free videos</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Everything you need to create</h2>
          <p className="text-slate-400 text-center mb-14">No video editing skills required.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:bg-violet-500/5 transition">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">How it works</h2>
          <div className="space-y-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {n}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to talk?</h2>
          <p className="text-slate-400 mb-8">Create your first talking avatar video for free. No camera needed.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-10 py-4 rounded-xl hover:opacity-90 transition shadow-lg shadow-violet-900/40 text-base">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Talkr · Powered by D-ID AI</p>
      </footer>
    </div>
  );
}
