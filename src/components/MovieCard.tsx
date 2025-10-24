import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { tmdb, type Movie } from '@/services/tmdb';
import { Card, CardContent } from '@/components/ui/card';

interface MovieCardProps {
  movie: Movie;
  type?: 'movie' | 'tv';
}

export const MovieCard = ({ movie, type = 'movie' }: MovieCardProps) => {
  const navigate = useNavigate();
  const mediaType = movie.media_type || type;

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-card border-0 transition-all duration-500 hover:scale-110 hover:shadow-glow"
      onClick={() => navigate(`/${mediaType}/${movie.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
          <img
            src={tmdb.getImageUrl(movie.poster_path)}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-bold text-sm mb-2 line-clamp-2 text-white">
                {movie.title || movie.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-white/90">
                {movie.vote_average ? (
                  <div className="flex items-center gap-1 glass-card px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                ) : null}
                {(movie.release_date || movie.first_air_date) && (
                  <span className="glass-card px-2 py-0.5 rounded-full">
                    {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 glass-card px-2 py-1 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            ▶
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
