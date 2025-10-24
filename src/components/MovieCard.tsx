import { useNavigate } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { tmdb, type Movie } from '@/services/tmdb';
import { Card, CardContent } from '@/components/ui/card';
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
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 513"%3E%3Crect fill="%23333" width="342" height="513"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  return (
    <Card
      className={`group cursor-pointer overflow-hidden bg-card border-0 transition-all duration-300 active:scale-95 select-none tap-highlight-transparent ${
        isPressed
          ? 'scale-95 shadow-lg'
          : 'hover:scale-110 hover:shadow-glow scale-100'
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
      <CardContent className="p-0 w-full h-full">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg md:rounded-xl bg-muted">
          {/* Poster Image */}
          <img
            src={tmdb.getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={handleImageError}
          />

          {/* Overlay Gradient - Desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-bold text-xs md:text-sm mb-2 line-clamp-2 text-black">
                {movie.title || movie.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-white/90 flex-wrap">
                {movie.vote_average ? (
                  <div className="flex items-center gap-1 glass-card px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                ) : null}
                {(movie.release_date || movie.first_air_date) && (
                  <span className="glass-card px-2 py-0.5 rounded-full whitespace-nowrap">
                    {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Info Overlay - Always visible on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-2 md:p-4">
            {/* Top Play Button */}
            <div className="flex justify-end">
              <div className="glass-card p-1.5 md:p-2 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Play className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="space-y-1.5 md:space-y-2 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-bold text-xs md:text-sm line-clamp-2 text-white">
                {movie.title || movie.name}
              </h3>
              <div className="flex items-center gap-1.5 md:gap-2 text-xs text-white/90 flex-wrap">
                {movie.vote_average ? (
                  <div className="flex items-center gap-0.5 md:gap-1 glass-card px-1.5 md:px-2 py-0.5 rounded-full">
                    <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-primary text-primary flex-shrink-0" />
                    <span className="font-semibold text-xs md:text-sm">{movie.vote_average.toFixed(1)}</span>
                  </div>
                ) : null}
                {(movie.release_date || movie.first_air_date) && (
                  <span className="glass-card px-1.5 md:px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                    {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};