// services/imdbRating.ts
const IMDB_API_KEY = 'a27643b76cmsh5d1d4ad5f129df6p17b608jsn636a163056de';
const IMDB_API_HOST = 'imdb236.p.rapidapi.com';

export interface IMDbRating {
  imdbId: string;
  rating: number;
  votes: number;
}

export const getIMDbRating = async (imdbId: string): Promise<IMDbRating | null> => {
  try {
    const response = await fetch(
      `https://imdb236.p.rapidapi.com/api/imdb/${imdbId}/rating`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': IMDB_API_KEY,
          'x-rapidapi-host': IMDB_API_HOST,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch IMDb rating');

    const data = await response.json();
    return {
      imdbId: data.imdbId,
      rating: data.rating || 0,
      votes: data.votes || 0,
    };
  } catch (error) {
    console.error('Error fetching IMDb rating:', error);
    return null;
  }
};