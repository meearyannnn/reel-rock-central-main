import { useEffect, useState } from 'react';
import { MovieCard } from './MovieCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { type Movie } from '@/services/tmdb';
import { ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  fetchData: () => Promise<{ results: Movie[] }>;
  type?: 'movie' | 'tv';
}

export const MovieRow = ({ title, fetchData, type = 'movie' }: MovieRowProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData();
        setMovies(data.results);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [fetchData]);

  return (
    <div className="mb-16 group/row">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="flex-1">
          <h2 className="text-3xl font-display font-400 text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <button className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 p-2 hover:bg-muted/50 rounded-full">
          <ChevronRight className="h-5 w-5 text-accent" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="px-4 flex gap-4 pb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-[200px] h-[300px] rounded-3xl bg-muted/30 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      ) : (
        /* Scroll Area */
        <ScrollArea className="w-full">
          <div className="flex gap-4 px-4 pb-4">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="w-[200px] flex-shrink-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <MovieCard movie={movie} type={type} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      )}
    </div>
  );
};