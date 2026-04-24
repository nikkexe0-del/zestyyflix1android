import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchFromTMDB, requests } from '../lib/tmdb';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const getNavClass = (category: string | null) => {
    const isActive = activeCategory === category && location.pathname === '/';
    return cn(
      "transition-all cursor-pointer font-medium",
      isActive
        ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        : "text-gray-300 hover:text-white"
    );
  };

  const getCreditsClass = () => cn(
    "transition-all cursor-pointer font-medium",
    location.pathname === '/credits'
      ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      : "text-gray-300 hover:text-white"
  );

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    if (searchQuery.length > 2) {
      debounceTimer = setTimeout(() => {
        fetchFromTMDB(requests.searchMulti(searchQuery))
          .then((data) => {
            if (data && data.results) {
              setSuggestions(
                data.results
                  .filter((item: any) => ['movie', 'tv', 'person'].includes(item.media_type))
                  .slice(0, 5)
              );
            }
          })
          .catch(console.error);
      }, 300);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
      setIsSearchOpen(false);
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 w-full h-20 z-50 transition-colors duration-300 flex justify-between items-center px-4 md:px-12 py-4 md:py-0',
        isScrolled ? 'bg-[#141414]/80 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5' : 'bg-transparent bg-gradient-to-b from-black/90 to-transparent'
      )}
    >
      <div className="flex items-center space-x-4 md:space-x-10">
        <button
          className="md:hidden text-white hover:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link to="/" className="text-red-600 font-black text-xl md:text-3xl tracking-tighter cursor-pointer">
          zestyyflix
        </Link>
        <div className="hidden md:flex space-x-5 text-[10px] md:text-sm font-light">
          <Link to="/" className={getNavClass(null)}>Home</Link>
          <Link to="/?category=tv" className={getNavClass('tv')}>TV Shows</Link>
          <Link to="/?category=movies" className={getNavClass('movies')}>Movies</Link>
          <Link to="/?category=popular" className={getNavClass('popular')}>New & Popular</Link>
          <Link to="/?category=watchlist" className={getNavClass('watchlist')}>Watchlist</Link>
          <Link to="/credits" className={getCreditsClass()}>About</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6 text-white text-xl relative">
        <div
          className={cn(
            "flex items-center transition-all duration-300 relative border",
            isSearchOpen
              ? "border-white/80 w-[200px] md:w-[260px] bg-black/80 backdrop-blur-md px-2 py-1.5"
              : "border-transparent w-8 px-1 py-1.5 bg-transparent"
          )}
        >
          <button
            onClick={() => {
              if (isSearchOpen && !searchQuery) setIsSearchOpen(false);
              else setIsSearchOpen(true);
            }}
            className="focus:outline-none shrink-0"
          >
            <Search className="w-5 h-5 cursor-pointer text-white" />
          </button>

          <form onSubmit={handleSearch} className="flex-1 overflow-hidden ml-2 flex items-center">
            <input
              autoFocus={isSearchOpen}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres"
              className={cn(
                "bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-full",
                isSearchOpen ? "opacity-100" : "opacity-0 invisible w-0"
              )}
            />
          </form>

          {isSearchOpen && searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="focus:outline-none shrink-0">
              <X className="w-4 h-4 text-white" />
            </button>
          )}

          {isSearchOpen && suggestions.length > 0 && (
            <div className="absolute top-[120%] right-0 w-[260px] bg-[#181818] border border-white/20 shadow-2xl z-50 flex flex-col max-h-[400px] overflow-y-auto no-scrollbar">
              <div className="text-xs text-gray-500 font-semibold px-4 py-2 border-b border-white/10 uppercase tracking-widest">Suggestions</div>
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="flex flex-col text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    setIsSearchOpen(false);
                    if (s.media_type === 'person') {
                      navigate(`/?actor=${s.id}&actorName=${encodeURIComponent(s.name)}`);
                    } else {
                      navigate(`/?q=${encodeURIComponent(s.title || s.name || s.original_name)}`);
                    }
                  }}
                >
                  <span className="text-sm font-medium text-white truncate w-full">{s.title || s.name || s.original_name}</span>
                  <span className="text-xs text-gray-400 capitalize mt-0.5">{s.media_type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#141414]/95 backdrop-blur-lg border-t border-gray-800 flex flex-col md:hidden py-4 px-4 space-y-4 shadow-xl z-50">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getNavClass(null)}>Home</Link>
          <Link to="/?category=tv" onClick={() => setIsMobileMenuOpen(false)} className={getNavClass('tv')}>TV Shows</Link>
          <Link to="/?category=movies" onClick={() => setIsMobileMenuOpen(false)} className={getNavClass('movies')}>Movies</Link>
          <Link to="/?category=popular" onClick={() => setIsMobileMenuOpen(false)} className={getNavClass('popular')}>New & Popular</Link>
          <Link to="/?category=watchlist" onClick={() => setIsMobileMenuOpen(false)} className={getNavClass('watchlist')}>Watchlist</Link>
          <Link to="/credits" onClick={() => setIsMobileMenuOpen(false)} className={getCreditsClass()}>About</Link>
        </div>
      )}
    </nav>
  );
}
