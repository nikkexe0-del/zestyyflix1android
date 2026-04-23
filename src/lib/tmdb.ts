export const TMDB_API_KEY = '493e89a3bd3410b312740f113e5a3d13';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const requests = {
  fetchTrending: `/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
  fetchIndianMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=IN&language=en-US&include_adult=false&with_watch_providers=8|119&watch_region=IN&sort_by=popularity.desc&vote_average.gte=6.5&vote_count.gte=10`,
  fetchIndianSeries: `/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=IN&language=en-US&include_adult=false&with_watch_providers=8|119&watch_region=IN&sort_by=popularity.desc&vote_average.gte=6.5&vote_count.gte=10`,
  fetchByActor: (id: string) => `/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${id}`,
  searchMulti: (query: string) => `/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`,
  
  // Standard Genres
  fetchActionMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
  fetchSciFi: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878`,
  fetchCrime: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=80`,
  fetchDrama: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=18`,
  fetchMystery: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=9648`,
  fetchAnimation: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16`,
  fetchFamily: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10751`,
  fetchFantasy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=14`,
  fetchHistory: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=36`,
  fetchMusic: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10402`,
  fetchThriller: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=53`,
  fetchWar: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10752`,
  fetchWestern: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=37`,
  
  // Combined / Specialized Genres
  fetchRomCom: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749,35`,
  fetchActionThriller: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28,53`,
  fetchSciFiAction: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878,28`,
  fetchDarkComedy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35,53`,
  fetchEpicFantasy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=14,12`,
  fetchHistoricalDrama: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=36,18`,
  fetchCrimeThriller: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=80,53`,
  fetchTeenMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&with_keywords=6270`,
  
  // Keyword based
  fetchSpace: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=3386`,
  fetchCyberpunk: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=10079`,
  fetchTimeTravel: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=4379`,
  fetchSupernatural: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=4344`,
  fetchSuperheroes: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=9715`,
  fetchMotivationSports: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=6075`,
  fetchZombies: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=12377`,
  fetchMartialArts: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=779`,
  fetchSpies: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=2518`,
  
  // TV Shows
  fetchTVActionAdventure: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10759`,
  fetchTVAnimation: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16`,
  fetchTVComedy: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35`,
  fetchTVCrime: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=80`,
  fetchTVDrama: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18`,
  fetchTVMystery: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=9648`,
  fetchTVSciFiFantasy: `/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765`,
  
  // High Rated Specifics
  fetchOscarWinners: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=825&sort_by=vote_average.desc&vote_count.gte=1000`,
  fetchCultClassics: `/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=3358`,
};

export async function fetchFromTMDB(endpoint: string) {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data from TMDB');
  }
  return response.json();
}

export async function fetchDetails(id: number | string, type: 'movie' | 'tv') {
  const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations,similar`);
  if (!response.ok) {
    throw new Error('Failed to fetch details');
  }
  return response.json();
}
