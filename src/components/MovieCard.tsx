import { useNavigate } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { tmdb, type Movie } from '@/services/tmdb';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  type?: 'movie' | 'tv';
}

export const MovieCard = ({ movie, type = 'movie' }: MovieCardProps) => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const mediaType = movie.media_type || type;

  const handleNavigate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(`/${mediaType}/${movie.id}`);
  };

  const handleTouchStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750"%3E%3Crect fill="%23333" width="500" height="750"/%3E%3C/svg%3E';
  };

  return (
    <div
      className={`relative cursor-pointer group overflow-hidden rounded-lg md:rounded-xl transition-all duration-300 active:scale-95 select-none tap-highlight-transparent ${
        isPressed ? 'scale-95' : 'hover:scale-105'
      }`}
      onClick={handleNavigate}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNavigate();
        }
      }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Image */}
        <img
          src={tmdb.getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button - Top Right */}
        <div className="absolute top-2 right-2 glass-card p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="h-4 w-4 md:h-5 md:w-5 text-white fill-white" />
        </div>

        {/* Bottom Info - Always visible, slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/95 to-transparent transform translate-y-2 md:translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
          {/* Title */}
          <h3 className="font-bold text-xs md:text-sm line-clamp-2 text-white mb-1.5 md:mb-2 leading-tight">
            {movie.title || movie.name}
          </h3>

          {/* Rating and Year */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            {movie.vote_average ? (
              <div className="flex items-center gap-0.5 md:gap-1 bg-black/60 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded-full border border-yellow-500/30">
                <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="font-semibold text-xs md:text-sm text-yellow-400">{movie.vote_average.toFixed(1)}</span>
              </div>
            ) : null}

            {(movie.release_date || movie.first_air_date) && (
              <span className="bg-black/60 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded-full text-xs md:text-sm text-white/90 whitespace-nowrap">
                {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
              </span>
            )}
          </div>
        </div>

        {/* Loading Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 animate-pulse" />
      </div>
    </div>
  );
};