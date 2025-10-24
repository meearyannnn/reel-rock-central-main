const TMDB_API_KEY = '3ca43ac7d6fb0198ecb572fa4db184bb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  budget?: number;
  revenue?: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date?: string;
  vote_average?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

const tmdbFetch = async (endpoint: string) => {
  const sep = endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}${sep}api_key=${TMDB_API_KEY}`);
  if (!response.ok) throw new Error('TMDB API request failed');
  return response.json();
};

export const tmdb = {
  getTrending: (type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'day') =>
    tmdbFetch(`/trending/${type}/${timeWindow}`),

  getPopular: (type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/${type}/popular`),

  getTopRated: (type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/${type}/top_rated`),

  getByGenre: (genreId: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/discover/${type}?with_genres=${genreId}`),

  getGenres: (type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/genre/${type}/list`),

  search: (query: string, type: 'movie' | 'tv' | 'multi' = 'multi') =>
    tmdbFetch(`/search/${type}?query=${encodeURIComponent(query)}`),

  getDetails: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/${type}/${id}`),

  getSeasonDetails: (tvId: number, seasonNumber: number) =>
    tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`),

  getCredits: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/${type}/${id}/credits`),

  getVideos: (id: number, type: 'movie' | 'tv' = 'movie') =>
    tmdbFetch(`/${type}/${id}/videos`),

  getImageUrl: (path: string, size: 'w500' | 'w300' | 'w185' | 'original' = 'w500') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder.svg',
};
