import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { Navbar } from '../components/Navbar';
import { Row } from '../components/Row';
import { InfoModal } from '../components/InfoModal';
import { Footer } from '../components/Footer';
import { requests } from '../lib/tmdb';
import { cn } from '../lib/utils';
import { useWatchlist } from '../hooks/useWatchlist';

export function HomeScreen() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const actor = searchParams.get('actor');
  const actorName = searchParams.get('actorName');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv'>('movie');
  
  // New features
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleMovieClick = (id: number, type: 'movie' | 'tv') => {
    setSelectedMovieId(id);
    setSelectedMediaType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="bg-[#141414] min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Loading Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-[#141414] flex flex-col items-center justify-center transition-all duration-700 pointer-events-none",
          isInitialLoading ? "opacity-100" : "opacity-0 invisible"
        )}
      >
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-white to-gray-700 animate-shimmer">
          zestyyflix
        </h1>
        <div className="mt-8 relative w-48 h-1 overflow-hidden bg-gray-900 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full w-full origin-left animate-pulse" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      <Navbar />
      
      {!query && !actor && category !== 'watchlist' && <Banner />}
      
      <div className={query || actor || category === 'watchlist' ? "pt-24 mt-10 relative z-30 space-y-12 mb-12 flex-1" : "-mt-24 md:-mt-48 relative z-30 space-y-12 mb-12 flex-1"}>
        
        {actor ? (
          <Row 
            title={`Movies featuring ${actorName}`} 
            fetchUrl={requests.fetchByActor(actor)} 
            isLargeRow 
            onMovieClick={handleMovieClick}
          />
        ) : query ? (
          <Row 
            title={`Search Results for "${query}"`} 
            fetchUrl={requests.searchMulti(query)} 
            isLargeRow 
            onMovieClick={handleMovieClick}
          />
        ) : (
          <>
            {category === 'watchlist' ? (
              watchlist.length > 0 ? (
                <Row title="My Watchlist" moviesList={watchlist} isLargeRow onMovieClick={handleMovieClick} />
              ) : (
                <div className="px-4 md:px-12 flex flex-col items-center justify-center pt-20 text-gray-400">
                  <h2 className="text-2xl font-bold mb-4">Your Watchlist is empty</h2>
                  <p>Add shows and movies to your Watchlist to keep track of what you want to watch.</p>
                </div>
              )
            ) : category === 'tv' ? (
              <>
                <Row title="TV Shows" fetchUrl={requests.fetchNetflixOriginals} isLargeRow type="tv" onMovieClick={handleMovieClick} />
                <Row title="Indian Series" fetchUrl={requests.fetchIndianSeries} type="tv" onMovieClick={handleMovieClick} />
              </>
            ) : category === 'movies' ? (
              <>
                <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Indian Movies" fetchUrl={requests.fetchIndianMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} type="movie" onMovieClick={handleMovieClick} />
              </>
            ) : category === 'popular' ? (
              <>
                <Row title="Trending Now" fetchUrl={requests.fetchTrending} isLargeRow onMovieClick={handleMovieClick} />
                <Row title="Top Rated" fetchUrl={requests.fetchTopRated} type="movie" onMovieClick={handleMovieClick} />
              </>
            ) : (
              // Default mixed view
              <>
                <Row title="Zestyyflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow type="tv" onMovieClick={handleMovieClick} />
                <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieClick={handleMovieClick} />
                <Row title="Indian Series" fetchUrl={requests.fetchIndianSeries} type="tv" onMovieClick={handleMovieClick} />
                <Row title="Indian Movies" fetchUrl={requests.fetchIndianMovies} type="movie" onMovieClick={handleMovieClick} />
                
                {/* 40+ dynamic infinite rows */}
                <Row title="Oscar Winners" fetchUrl={requests.fetchOscarWinners} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Action Thrillers" fetchUrl={requests.fetchActionThriller} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Rom-Coms" fetchUrl={requests.fetchRomCom} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Sci-Fi Marvels" fetchUrl={requests.fetchSciFi} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Epic Fantasy" fetchUrl={requests.fetchEpicFantasy} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Dark Comedies" fetchUrl={requests.fetchDarkComedy} type="movie" onMovieClick={handleMovieClick} />
                <Row title="TV Dramas" fetchUrl={requests.fetchTVDrama} type="tv" onMovieClick={handleMovieClick} />
                <Row title="TV Sci-Fi & Fantasy" fetchUrl={requests.fetchTVSciFiFantasy} type="tv" onMovieClick={handleMovieClick} />
                <Row title="Animation Classics" fetchUrl={requests.fetchAnimation} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Spies & Espionage" fetchUrl={requests.fetchSpies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Crime Stories" fetchUrl={requests.fetchCrime} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Top Rated Hits" fetchUrl={requests.fetchTopRated} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Historical Dramas" fetchUrl={requests.fetchHistoricalDrama} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Space Exploration" fetchUrl={requests.fetchSpace} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Superheroes" fetchUrl={requests.fetchSuperheroes} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Cyberpunk Vibes" fetchUrl={requests.fetchCyberpunk} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Time Travel Mindbenders" fetchUrl={requests.fetchTimeTravel} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Supernatural" fetchUrl={requests.fetchSupernatural} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Martial Arts" fetchUrl={requests.fetchMartialArts} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Motivation & Sports" fetchUrl={requests.fetchMotivationSports} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Zombie Apocalypse" fetchUrl={requests.fetchZombies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Teen Movies" fetchUrl={requests.fetchTeenMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Cult Classics" fetchUrl={requests.fetchCultClassics} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Family Nights" fetchUrl={requests.fetchFamily} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Mystery Solvers" fetchUrl={requests.fetchMystery} type="movie" onMovieClick={handleMovieClick} />
                <Row title="War Epics" fetchUrl={requests.fetchWar} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Westerns" fetchUrl={requests.fetchWestern} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Music & Musicals" fetchUrl={requests.fetchMusic} type="movie" onMovieClick={handleMovieClick} />
                <Row title="TV Comedies" fetchUrl={requests.fetchTVComedy} type="tv" onMovieClick={handleMovieClick} />
                <Row title="TV Crime Mysteries" fetchUrl={requests.fetchTVCrime} type="tv" onMovieClick={handleMovieClick} />
                <Row title="TV Action Adrenaline" fetchUrl={requests.fetchTVActionAdventure} type="tv" onMovieClick={handleMovieClick} />
                <Row title="TV Watch Alongside Kids" fetchUrl={requests.fetchTVAnimation} type="tv" onMovieClick={handleMovieClick} />
                <Row title="Pure Action" fetchUrl={requests.fetchActionMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Pure Comedy" fetchUrl={requests.fetchComedyMovies} type="movie" onMovieClick={handleMovieClick} />
                <Row title="Pure Horror" fetchUrl={requests.fetchHorrorMovies} type="movie" onMovieClick={handleMovieClick} />
              </>
            )}
          </>
        )}
      </div>

      <Footer />

      <InfoModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        movieId={selectedMovieId} 
        mediaType={selectedMediaType} 
      />
    </div>
  );
}
