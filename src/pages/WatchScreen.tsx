import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDetails, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { Row } from '../components/Row';

export function WatchScreen() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const season = Number(searchParams.get('s')) || 1;
  const episode = Number(searchParams.get('e')) || 1;

  const [details, setDetails] = useState<Movie | null>(null);

  useEffect(() => {
    if (id && type) {
      fetchDetails(id, type as 'movie' | 'tv').then(setDetails).catch(console.error);
    }
  }, [id, type]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  // Vidlink URLs
  const movieUrl = `https://vidlink.pro/movie/${id}`;
  const tvUrl = `https://vidlink.pro/tv/${id}/${season}/${episode}`;

  const videoUrl = type === 'tv' ? tvUrl : movieUrl;

  const director = details?.credits?.crew.find(c => c.job === 'Director') || details?.credits?.crew.find(c => c.job === 'Executive Producer');
  const cast = details?.credits?.cast.slice(0, 10) || [];
  
  // Combine recommendations and similar, removing duplicates
  const recommendations = details?.recommendations?.results?.length 
    ? details.recommendations.results 
    : (details as any)?.similar?.results || [];

  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col relative overflow-x-hidden">
      {/* Top Navbar - Only Back Button */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-50 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-xs md:text-xl font-medium hidden sm:block">Back</span>
        </button>
      </div>

      {/* Video Player Box */}
      <div className="w-full aspect-video md:h-[80vh] md:aspect-auto relative z-0 bg-black shadow-2xl">
        <iframe
          src={videoUrl}
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Playback Controls Underneath Player */}
      <div className="w-full bg-[#181818] border-b border-white/10 px-4 md:px-12 py-4 shadow-lg sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {type === 'tv' && (
              <div className="flex items-center gap-4">
                <div className="flex gap-2 items-center bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                  <label htmlFor="season" className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Season</label>
                  <select 
                    id="season"
                    value={season}
                    onChange={(e) => updateParam('s', e.target.value)}
                    className="bg-zinc-900 text-white border-0 font-bold rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
                  >
                    {[...Array(details?.number_of_seasons || 20)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-center bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                  <label htmlFor="episode" className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Episode</label>
                  <select 
                    id="episode"
                    value={episode}
                    onChange={(e) => updateParam('e', e.target.value)}
                    className="bg-zinc-900 text-white border-0 font-bold rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
                  >
                    {[...Array(40)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}


          </div>

          {/* Social or Share Placeholder */}
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Now Playing on <span className="text-red-600">Zestyyflix</span>
          </div>
        </div>
      </div>

      {/* Details Section Underneath */}
      {details && (
        <div className="px-4 md:px-12 py-8 text-white max-w-7xl mx-auto w-full flex-1">
          <div className="flex items-start justify-between flex-wrap gap-6 mb-10 border-b border-white/10 pb-8">
            <div className="max-w-3xl">
              <h1 className="text-xl md:text-5xl font-bold tracking-tighter mb-4">
                {details.title || details.name || details.original_name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-base text-gray-400 mb-6 font-medium">
                {(details.vote_average && details.vote_average > 0) ? (
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <span className="text-yellow-500">★</span> 
                    {details.vote_average.toFixed(1)} Rating
                  </span>
                ) : null}
                
                {details.release_date || details.first_air_date ? (
                  <span>{(details.release_date || details.first_air_date)?.substring(0,4)}</span>
                ) : null}
                
                {details.runtime ? (
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                ) : type === 'tv' && details.number_of_seasons ? (
                  <span>{details.number_of_seasons} Seasons</span>
                ) : null}

                <span className="border border-gray-600 px-2 rounded-sm text-xs text-gray-300 bg-white/5">HD</span>
              </div>
              
              <p className="text-gray-300 text-sm md:text-lg leading-relaxed">{details.overview}</p>
              
              {details.genres && details.genres.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-400">
                  <span className="text-gray-500">Genres:</span>
                  {details.genres.map(g => (
                    <span key={g.id} className="hover:text-white cursor-pointer transition-colors hover:underline">
                      {g.name}
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr] as any)}
                </div>
              )}
            </div>

            {director && (
              <div className="flex flex-col gap-3 min-w-[200px] border border-white/5 bg-white/5 p-4 rounded-xl">
                <span className="text-sm text-gray-500 font-medium uppercase tracking-widest">{director.job}</span>
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/?actor=${director.id}&actorName=${encodeURIComponent(director.name)}`)}
                >
                  {director.profile_path ? (
                    <img 
                      src={`${TMDB_IMAGE_BASE_URL}${director.profile_path}`} 
                      alt={director.name} 
                      className="w-12 h-12 rounded-full object-cover shadow-lg border border-white/10 group-hover:border-white/40 transition-colors"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10">
                      {director.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium group-hover:text-red-400 transition-colors">{director.name}</span>
                </div>
              </div>
            )}
          </div>

          {cast.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-gray-200">Top Cast</h3>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar snap-x">
                {cast.map(actor => (
                  <button
                    key={actor.id}
                    onClick={() => navigate(`/?actor=${actor.id}&actorName=${encodeURIComponent(actor.name)}`)}
                    className="flex flex-col items-center gap-3 shrink-0 snap-start group text-center w-24 md:w-32"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-all duration-300 shadow-xl bg-gray-900">
                      {actor.profile_path ? (
                        <img 
                          src={`${TMDB_IMAGE_BASE_URL}${actor.profile_path}`} 
                          alt={actor.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-light bg-zinc-800">
                          {actor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-1">{actor.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{actor.character}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* You Might Also Like Section using existing Row component */}
      <div className="mb-16 -mt-4">
        {recommendations.length > 0 && (
          <Row 
            title="You Might Also Like" 
            moviesList={recommendations} 
            type={type as 'movie' | 'tv'}
            onMovieClick={(newId, newType) => {
              navigate(`/watch/${newType}/${newId}`);
              window.scrollTo(0, 0);
            }} 
          />
        )}
      </div>
    </div>
  );
}
