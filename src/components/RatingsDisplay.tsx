// components/RatingsDisplay.tsx
import { Star } from 'lucide-react';
import { useMovieRatings, type MovieRatings } from '@/services/ratingsService';

interface RatingsDisplayProps {
  imdbId: string | undefined;
  className?: string;
}

export const RatingsDisplay = ({ imdbId, className = '' }: RatingsDisplayProps) => {
  const { ratings, isLoading } = useMovieRatings(imdbId);

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="premium-card h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!ratings) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'from-green-500 to-emerald-600';
    if (rating >= 7) return 'from-blue-500 to-cyan-600';
    if (rating >= 6) return 'from-yellow-500 to-amber-600';
    return 'from-orange-500 to-red-600';
  };

  const ratingItems = [
    {
      label: 'IMDb',
      rating: ratings.imdbRating,
      icon: '🎬',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Rotten Tomatoes',
      rating: ratings.rottenTomatoesRating,
      icon: '🍅',
      color: 'from-red-500 to-red-700',
    },
    {
      label: 'Metacritic',
      rating: ratings.metacriticRating,
      icon: '⭐',
      color: 'from-purple-500 to-purple-700',
    },
    {
      label: 'TMDB',
      rating: ratings.tmdbRating,
      icon: '🎭',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {ratingItems.map((item) => (
        <div
          key={item.label}
          className={`premium-card p-4 rounded-2xl border border-border/30 hover:border-primary/50 transition-all duration-300 group cursor-pointer`}
        >
          <div className="text-center space-y-2">
            <div className="text-3xl group-hover:scale-125 transition-transform">
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">
                {item.label}
              </p>
              <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.rating > 0 ? item.rating.toFixed(1) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};