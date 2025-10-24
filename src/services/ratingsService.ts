// services/ratingsService.ts
const RATINGS_API_KEY = 'a27643b76cmsh5d1d4ad5f129df6p17b608jsn636a163056de';
const RATINGS_API_HOST = 'movies-ratings2.p.rapidapi.com';

export interface MovieRatings {
  imdbId: string;
  imdbRating: number;
  rottenTomatoesRating: number;
  metacriticRating: number;
  tmdbRating: number;
}

export const getMovieRatings = async (imdbId: string): Promise<MovieRatings | null> => {
  try {
    if (!imdbId || !imdbId.startsWith('tt')) {
      console.warn('Invalid IMDb ID:', imdbId);
      return null;
    }

    const response = await fetch(
      `https://movies-ratings2.p.rapidapi.com/ratings?id=${imdbId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RATINGS_API_KEY,
          'x-rapidapi-host': RATINGS_API_HOST,
        },
      }
    );

    if (!response.ok) {
      console.error('Ratings API Error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Ratings Response:', data);

    return {
      imdbId: data.imdbId || imdbId,
      imdbRating: data.imdbRating || 0,
      rottenTomatoesRating: data.rottenTomatoesRating || 0,
      metacriticRating: data.metacriticRating || 0,
      tmdbRating: data.tmdbRating || 0,
    };
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return null;
  }
};

// Hook for React components
import { useEffect, useState } from 'react';

export const useMovieRatings = (imdbId: string | undefined) => {
  const [ratings, setRatings] = useState<MovieRatings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imdbId) return;

    const fetchRatings = async () => {
      setIsLoading(true);
      try {
        const data = await getMovieRatings(imdbId);
        setRatings(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [imdbId]);

  return { ratings, isLoading };
};