import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFromTMDB, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface RowProps {
  title: string;
  fetchUrl?: string; // Made optional
  moviesList?: Movie[]; // Added for local data
  isLargeRow?: boolean;
  type?: 'movie' | 'tv';
  onMovieClick?: (id: number, type: 'movie' | 'tv') => void;
}

export function Row({ title, fetchUrl, moviesList, isLargeRow = false, type, onMovieClick }: RowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible && !moviesList) return;

    if (moviesList) {
      setMovies(moviesList);
      return;
    }
    
    // Reset when URL changes
    setPage(1);
    
    async function fetchInitialData() {
      try {
        if (!fetchUrl) return;
        const pageUrl = fetchUrl.includes('?') ? `${fetchUrl}&page=1` : `${fetchUrl}?page=1`;
        const data = await fetchFromTMDB(pageUrl);
        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Failed to fetch initial row data", error);
      }
    }
    fetchInitialData();
  }, [fetchUrl, moviesList, isVisible]);

  const loadMore = async () => {
    if (!fetchUrl || moviesList || page >= totalPages || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const pageUrl = fetchUrl.includes('?') ? `${fetchUrl}&page=${nextPage}` : `${fetchUrl}?page=${nextPage}`;
      const data = await fetchFromTMDB(pageUrl);
      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch more data", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();

  if (!isVisible && !moviesList) {
    return <div ref={containerRef} className={cn("w-full pl-4 md:pl-12 mb-8", isLargeRow ? "h-[300px]" : "h-[200px]")} />;
  }

  return (
    <div ref={containerRef} className="pl-4 md:pl-12 group w-full mb-8">
      <div 
        className="text-sm md:text-xl font-bold mb-4 flex items-center group w-max text-white cursor-pointer uppercase tracking-tight"
        onClick={() => {
          if (fetchUrl) {
            navigate(`/category?title=${encodeURIComponent(title)}&url=${encodeURIComponent(fetchUrl)}`);
            window.scrollTo(0, 0);
          }
        }}
      >
        {title}
        {fetchUrl ? (
          <span className="ml-3 text-xs md:text-sm text-[#54b9c5] group-hover:text-white font-semibold transition-colors flex items-center">
            Show more <span className="text-lg leading-none ml-0.5">&rsaquo;</span>
          </span>
        ) : null}
      </div>

      <div className="relative">
        <button
          className={cn(
            "absolute top-0 bottom-0 left-0 bg-black/50 z-40 w-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70",
            !isMoved && "hidden"
          )}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center space-x-2 overflow-x-scroll no-scrollbar scroll-smooth w-full pr-12 pb-4"
          onScroll={(e) => {
             if (e.currentTarget.scrollLeft > 0) {
               setIsMoved(true);
             } else {
               setIsMoved(false);
             }
          }}
        >
          {movies.map((movie, index) => {
             const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
             if (!imagePath) return null;
             
             // Determine media type for link
             let mediaType = type;
             if (!mediaType) {
               mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
             }

              return (
               <div key={`${movie.id}-${index}`} className="flex flex-col gap-2 shrink-0 group/item">
                 <button 
                   onClick={() => onMovieClick && onMovieClick(movie.id, mediaType as 'movie' | 'tv')}
                   className={cn(
                     "relative transition-transform duration-300 hover:scale-105 shrink-0 hover:z-50 cursor-pointer overflow-hidden border border-white/10 rounded block",
                     isLargeRow ? "w-[150px] md:w-[200px]" : "w-[240px] md:w-[320px]"
                   )}
                 >
                   <img
                     src={`${TMDB_IMAGE_BASE_URL}${imagePath}`}
                     alt={movie.name || movie.title}
                     className={cn(
                       "w-full object-cover rounded shadow-lg",
                       isLargeRow ? "h-[225px] md:h-[300px]" : "h-[135px] md:h-[180px]"
                     )}
                     referrerPolicy="no-referrer"
                     loading="lazy"
                   />
                   
                   {/* TMDB Rating Overlay */}
                   {movie.vote_average && movie.vote_average > 0 ? (
                     <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1 shadow-xl border border-white/10">
                       <span className="text-yellow-500 drop-shadow">★</span> {movie.vote_average.toFixed(1)}
                     </div>
                   ) : null}

                   <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity">
                     <p className="text-white text-sm font-medium truncate">
                       {movie.title || movie.name || movie.original_name}
                     </p>
                   </div>
                 </button>
                 <p className="text-white text-xs md:text-sm font-medium text-center truncate max-w-full px-1 w-full" style={{ maxWidth: isLargeRow ? '200px' : '320px' }}>
                   {movie.title || movie.name || movie.original_name}
                 </p>
               </div>
              );
          })}
          
          {/* LOAD MORE TILE */}
          {!moviesList && (
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                   if (fetchUrl) {
                     navigate(`/category?title=${encodeURIComponent(title)}&url=${encodeURIComponent(fetchUrl)}`);
                     window.scrollTo(0, 0);
                   }
                }}
                className={cn(
                  "flex flex-col items-center justify-center shrink-0 border border-white/20 bg-white/5 hover:bg-white/10 rounded transition-all duration-300 hover:scale-105 group/more",
                  isLargeRow ? "w-[150px] md:w-[200px] h-[225px] md:h-[300px]" : "w-[240px] md:w-[320px] h-[135px] md:h-[180px]"
                )}
              >
                <Plus className="w-10 h-10 text-white opacity-70 group-hover/more:opacity-100 transition-opacity group-hover/more:text-red-500" />
                <span className="text-white opacity-70 font-medium tracking-wide group-hover/more:opacity-100 transition-opacity mt-2">See all</span>
              </button>
              <div className="h-4"></div> {/* Spacing spacer for textual titles underneath */}
            </div>
          )}
        </div>

        <button
          className="absolute top-0 bottom-0 right-0 bg-black/50 z-40 w-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
