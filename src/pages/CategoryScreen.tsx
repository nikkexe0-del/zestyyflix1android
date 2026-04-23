import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fetchFromTMDB, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { Loader2 } from 'lucide-react';
import { InfoModal } from '../components/InfoModal';

export function CategoryScreen() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title') || 'Category';
  const fetchUrl = searchParams.get('url');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv'>('movie');
  
  useEffect(() => {
    // Reset state on url change
    setMovies([]);
    setPage(1);
    
    async function fetchInitial() {
      if (!fetchUrl) return;
      setLoading(true);
      try {
        const urlToFetch = fetchUrl.includes('?') ? `${fetchUrl}&page=1` : `${fetchUrl}?page=1`;
        const data = await fetchFromTMDB(urlToFetch);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Failed to fetch initial category data", error);
      } finally {
         setLoading(false);
      }
    }
    
    fetchInitial();
  }, [fetchUrl]);
  
  const loadMore = async () => {
    if (!fetchUrl || page >= totalPages || loading) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const urlToFetch = fetchUrl.includes('?') ? `${fetchUrl}&page=${nextPage}` : `${fetchUrl}?page=${nextPage}`;
      const data = await fetchFromTMDB(urlToFetch);
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch more category data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (id: number, type: 'movie' | 'tv') => {
    setSelectedMovieId(id);
    setSelectedMediaType(type);
    setModalOpen(true);
  };

  // Add scroll listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      // Check if we are near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
         if (!loading && page < totalPages) {
           loadMore();
         }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, totalPages]);

  return (
    <div className="bg-[#141414] min-h-screen flex flex-col relative overflow-x-hidden pt-24 text-white">
      <Navbar />
      
      <div className="flex-1 px-4 md:px-12 w-full max-w-[1600px] mx-auto pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 drop-shadow-md">{title}</h1>
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
            {movies.map((movie, index) => {
              const imagePath = movie.poster_path;
              if (!imagePath) return null;
              
              const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
              
              return (
                <div key={`${movie.id}-${index}`} className="flex flex-col gap-2 group cursor-pointer" onClick={() => handleMovieClick(movie.id, mediaType)}>
                  <div className="relative overflow-hidden rounded shadow-lg aspect-[2/3] border border-white/10 group-hover:border-white/30 transition-colors duration-300">
                    <img 
                      src={`${TMDB_IMAGE_BASE_URL}${imagePath}`}
                      alt={movie.title || movie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {movie.vote_average && movie.vote_average > 0 ? (
                       <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1 shadow-xl">
                         <span className="text-yellow-500 drop-shadow">★</span> {movie.vote_average.toFixed(1)}
                       </div>
                    ) : null}
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                           <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white ml-1"></div>
                        </div>
                     </div>
                  </div>
                  <p className="text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">
                    {movie.title || movie.name || movie.original_name}
                  </p>
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="text-gray-500 py-20 text-center text-xl">No content found</div>
        ) : null}
        
        {loading && (
          <div className="w-full flex justify-center py-10 mt-10">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        )}
      </div>

      <Footer />
      
      <InfoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        movieId={selectedMovieId} 
        mediaType={selectedMediaType} 
      />
    </div>
  );
}
