import { X, Play, Plus, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDetails, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number | null;
  mediaType: 'movie' | 'tv';
}

export function InfoModal({ isOpen, onClose, movieId, mediaType }: InfoModalProps) {
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  useEffect(() => {
    if (isOpen && movieId) {
      fetchDetails(movieId, mediaType).then((data) => {
        setMovieDetails(data);
        setSelectedSeason(1); // Reset
        setSelectedEpisode(1);
      }).catch(console.error);
    }
  }, [isOpen, movieId, mediaType]);

  if (!isOpen || (!movieId)) return null;

  const isSaved = isInWatchlist(movieId);

  const handleWatchlistToggle = () => {
    if (isSaved) {
      removeFromWatchlist(movieId);
    } else if (movieDetails) {
      addToWatchlist({
        id: movieDetails.id,
        title: movieDetails.title,
        name: movieDetails.name,
        original_name: movieDetails.original_name,
        poster_path: movieDetails.poster_path,
        backdrop_path: movieDetails.backdrop_path,
        media_type: mediaType,
      });
    }
  };

  const director = movieDetails?.credits?.crew?.find(c => c.job === 'Director')?.name || 'Unknown';
  const cast = movieDetails?.credits?.cast?.slice(0, 4).map(c => c.name).join(', ') || 'Unknown';
  
  const playLink = mediaType === 'tv' 
    ? `/watch/${mediaType}/${movieId}?s=${selectedSeason}&e=${selectedEpisode}`
    : `/watch/${mediaType}/${movieId}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#181818] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Hero */}
        <div className="relative h-[40vh] md:h-[50vh] w-full shrink-0">
          {movieDetails?.backdrop_path ? (
            <img 
              src={`${TMDB_IMAGE_BASE_URL}${movieDetails.backdrop_path}`} 
              alt="Backdrop" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:left-12 pr-6 flex flex-col items-start gap-4">
            <h2 className="text-xl md:text-5xl font-bold text-white drop-shadow-md">
              {movieDetails?.title || movieDetails?.name}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <Link
                  to={playLink}
                  className="inline-flex items-center space-x-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-200 transition-colors shadow-lg"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  <span>Play</span>
                </Link>
                <button
                  onClick={handleWatchlistToggle}
                  className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/50 rounded-full flex items-center justify-center bg-black/50 hover:border-white transition-all group shadow-lg"
                >
                  {isSaved ? <Check className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Plus className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />}
                </button>
              </div>
              
              {mediaType === 'tv' && (
                <div className="flex gap-3 items-center mt-1">
                  <div className="flex gap-2 items-center bg-black/40 px-3 py-1.5 rounded backdrop-blur-md border border-white/10">
                    <label htmlFor="modal-season" className="text-white text-xs font-semibold uppercase tracking-wider">Season</label>
                    <select 
                      id="modal-season"
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="bg-zinc-800 text-white border border-zinc-700 text-sm font-medium rounded px-1.5 py-0.5 outline-none focus:border-white transition-colors"
                    >
                      {[...Array(movieDetails?.number_of_seasons || 10)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center bg-black/40 px-3 py-1.5 rounded backdrop-blur-md border border-white/10">
                    <label htmlFor="modal-episode" className="text-white text-xs font-semibold uppercase tracking-wider">Episode</label>
                    <select 
                      id="modal-episode"
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                      className="bg-zinc-800 text-white border border-zinc-700 text-sm font-medium rounded px-1.5 py-0.5 outline-none focus:border-white transition-colors"
                    >
                      {[...Array(40)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex flex-col md:flex-row gap-8 p-6 md:p-12 overflow-y-auto">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-500 font-semibold text-base">
                {movieDetails?.vote_average ? `${Math.round(movieDetails.vote_average * 10)}% Match` : ''}
              </span>
              <span className="text-gray-300">
                {(movieDetails?.first_air_date || movieDetails?.release_date)?.substring(0, 4)}
              </span>
              <span className="border border-gray-600 px-2 py-0.5 rounded text-gray-300 whitespace-nowrap">HD</span>
            </div>
            <p className="text-gray-200 text-xs md:text-base leading-relaxed">
              {movieDetails?.overview}
            </p>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col gap-4 text-sm">
            <div>
              <span className="text-gray-500">Cast: </span>
              <span className="text-gray-200">
                {(movieDetails?.credits?.cast?.slice(0, 4) || []).map((c, i, arr) => (
                  <span key={c.id}>
                    <Link 
                      to={`/?actor=${c.id}&actorName=${encodeURIComponent(c.name)}`}
                      onClick={onClose}
                      className="hover:text-white transition-colors hover:underline"
                    >
                      {c.name}
                    </Link>
                    {i < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Director: </span>
              <span className="text-gray-200">{director}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
