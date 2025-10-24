// services/aiRecommender.ts
import { tmdb, type Movie } from './tmdb'; // Import your TMDB service

const AI_API_KEY = 'a27643b76cmsh5d1d4ad5f129df6p17b608jsn636a163056de';
const AI_API_HOST = 'ai-movie-recommender.p.rapidapi.com';

export interface RecommendedMovie {
  id: string;
  title: string;
  description: string;
  genre: string;
  rating: number;
  image_url?: string;
}

export const searchMoviesByMood = async (query: string): Promise<RecommendedMovie[]> => {
  try {
    // Use TMDB search for better results
    const response = await tmdb.search(query, 'movie');
    
    console.log('Search Results:', response);

    if (!response.results || response.results.length === 0) {
      return [];
    }

    return response.results.map((movie: Movie) => ({
      id: movie.id.toString(),
      title: movie.title || movie.name || 'Unknown',
      description: movie.overview || '',
      genre: 'Movie',
      rating: movie.vote_average || 0,
      image_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
