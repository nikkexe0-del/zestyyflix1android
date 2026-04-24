export function Footer() {
  return (
    <footer className="w-full text-gray-500 py-8 px-4 md:px-12 mt-8 border-t border-white/5 bg-[#141414]">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 text-sm text-center">
        <p className="text-gray-300 font-semibold tracking-wide text-base">zestyyflix.vercel.app</p>
        <p className="text-gray-500">Love the app? Have suggestions? Connect with me through Instagram!</p>
        <a 
          href="https://instagram.com/nikkk.exe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 hover:text-white transition-colors flex items-center gap-1.5 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10"
        >
          nikkk.exe <span className="text-lg leading-none">↗</span>
        </a>
      </div>
    </footer>
  );
}
