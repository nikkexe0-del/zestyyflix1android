import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Shield, Eye, Lock, Heart } from 'lucide-react';
import { Footer } from '../components/Footer';

export function CreditsScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#141414] min-h-screen flex flex-col text-white overflow-x-hidden">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-12 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-xl font-black tracking-tighter text-white">About & Privacy</h1>
      </div>

      <div className="flex-1 px-4 md:px-12 py-10 max-w-3xl mx-auto w-full space-y-10">

        {/* App Logo */}
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-24 h-24 rounded-2xl bg-black border border-red-600/40 flex items-center justify-center shadow-2xl shadow-red-900/30">
            <span className="text-red-600 font-black text-5xl tracking-tighter">Z</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            zestyyflix
          </h2>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
            All OTTs. One App.
          </span>
        </div>

        {/* Message from Dev */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <Heart className="w-5 h-5 fill-red-500" />
            <span className="font-bold text-sm uppercase tracking-widest">A message from the developer</span>
          </div>
          <p className="text-gray-300 leading-relaxed text-base">
            Hey! I built Zestyyflix because I was tired of juggling subscriptions across 10 different streaming platforms just to watch what I love. This app is my attempt to bring it all together — movies, series, everything — in one clean, fast, ad-light experience.
          </p>
          <p className="text-gray-300 leading-relaxed text-base">
            I don't collect your data. I don't track what you watch. Your watchlist lives on your device and nowhere else. No accounts, no sign-ups, no BS.
          </p>
          <p className="text-gray-300 leading-relaxed text-base">
            If you enjoy the app, share it with a friend. That's all I ask. 🙏
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-500 text-sm">— nikkk.exe</span>
            <a
              href="https://instagram.com/nikkk.exe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white hover:text-red-400 transition-colors font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10"
            >
              <Instagram className="w-4 h-4" />
              nikkk.exe
            </a>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Privacy Policy
          </h3>

          <div className="space-y-3">
            {[
              { icon: Eye, color: 'text-blue-400', title: 'No tracking', desc: 'We do not track your viewing activity, search history, or behavior in any way.' },
              { icon: Lock, color: 'text-yellow-400', title: 'Local data only', desc: 'Your watchlist is stored locally on your device using localStorage. It never leaves your device.' },
              { icon: Shield, color: 'text-green-400', title: 'No accounts', desc: 'No sign-up, no login, no profile. You are completely anonymous while using Zestyyflix.' },
              { icon: Heart, color: 'text-red-400', title: 'Content via TMDB & vidlink', desc: 'Movie metadata is fetched from The Movie Database (TMDB). Streams are served via vidlink.pro embeds. We do not host any content.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-4 bg-white/3 border border-white/8 rounded-xl p-4">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-200">Built with</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'TMDB API', 'vidlink.pro', 'Capacitor', 'React Router'].map(tech => (
              <span key={tech} className="text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-gray-600 text-xs pb-4">
          Zestyyflix v1.0.0 · Made with ❤️ in India
        </div>

      </div>

      <Footer />
    </div>
  );
}
