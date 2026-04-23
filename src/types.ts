export interface Movie {
  id: number;
  name?: string;
  title?: string;
  original_name?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  media_type?: string;
  first_air_date?: string;
  release_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  runtime?: number;
  credits?: {
    cast: { id: number; name: string; profile_path: string | null; character: string }[];
    crew: { id: number; name: string; job: string; profile_path: string | null }[];
  };
  recommendations?: {
    results: Movie[];
  };
}
