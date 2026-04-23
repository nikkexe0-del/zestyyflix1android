import { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFromTMDB, requests, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Banner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFromTMDB(requests.fetchTrending);
        // Take top 5 trending movies for the carousel
        setMovies(data.results.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch banner movies", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 7000); // Auto swap every 7 seconds
    
    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) return <div className="h-[75vh] min-h-[500px] bg-[#141414]" />;

  const movie = movies[currentIndex];
  const playLink = `/watch/${movie?.media_type || 'movie'}/${movie.id}`;

  const handleSwipe = (_e: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    } else if (info.offset.x > threshold) {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }
  };

  return (
    <motion.header 
      onPanEnd={handleSwipe}
      className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] bg-[#141414] overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: movie?.backdrop_path ? `url(${TMDB_IMAGE_BASE_URL}${movie.backdrop_path})` : 'none',
              backgroundPosition: 'center top'
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/20 z-10" /> {/* Slight dark tint for text readability */}
      
      <div className="absolute inset-0 z-40 pl-4 md:pl-12 flex flex-col justify-end pb-32 md:pb-52 pt-24 max-w-4xl pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${movie.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-3 md:mb-5 drop-shadow-md">
              <div className="bg-red-600 text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded capitalize shadow-lg">{movie?.media_type || 'Movie'}</div>
              <div className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white drop-shadow-md">Zestyyflix Original</div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight drop-shadow-lg text-white max-w-3xl">
              {movie?.title || movie?.name || movie?.original_name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 text-[10px] sm:text-sm md:text-lg drop-shadow-md">
              <span className="text-green-500 font-bold">98% Match</span>
              {(movie?.first_air_date || movie?.release_date) && (
                <span className="text-gray-300 font-medium">{(movie?.first_air_date || movie?.release_date)?.substring(0,4)}</span>
              )}
              <span className="border border-gray-500 px-1.5 py-0.5 text-[10px] md:text-xs text-gray-300 rounded font-medium">16+</span>
              <span className="bg-white/10 px-1.5 py-0.5 text-[10px] md:text-xs rounded text-gray-300 border border-white/5 font-medium">4K Ultra HD</span>
            </div>
            
            <p className="text-xs sm:text-base md:text-lg text-gray-200 mb-6 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-md font-medium">
              {movie?.overview}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Link
                to={playLink}
                className="flex items-center space-x-2 md:space-x-3 bg-white text-black px-4 md:px-8 py-1.5 md:py-3 rounded font-bold hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Play className="w-4 h-4 md:w-6 md:h-6 fill-black" />
                <span className="text-xs sm:text-base md:text-lg">Play Now</span>
              </Link>
              <button
                onClick={() => {
                  // This is handled via the HomeScreen's handleMovieClick if we were there, 
                  // but Banner is separate. We'll use the watch link for now or 
                  // we'd need to lift state. Since Banner uses Link to /watch, it's fine.
                }}
                className="hidden" // Placeholder as we use Link mainly
              />
              <Link 
                to={playLink}
                className="flex items-center space-x-2 md:space-x-3 bg-gray-500/50 text-white px-4 md:px-8 py-1.5 md:py-3 rounded font-bold hover:bg-gray-500/70 backdrop-blur-md transition-colors border border-transparent shadow-lg"
              >
                <Info className="w-4 h-4 md:w-6 md:h-6" />
                <span className="text-xs sm:text-base md:text-lg">More Info</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Paginator Dots */}
      <div className="absolute bottom-48 md:bottom-64 right-8 md:right-12 z-50 flex gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-500",
              idx === currentIndex ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 w-full h-32 md:h-64 bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent z-20 pointer-events-none" />
    </motion.header>
  );
}
