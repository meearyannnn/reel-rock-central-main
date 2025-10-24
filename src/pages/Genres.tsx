import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { MovieCard } from '@/components/MovieCard';
import { tmdb, type Movie, type Genre } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const GenresPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(
    searchParams.get('genre') ? Number(searchParams.get('genre')) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [touchHoldId, setTouchHoldId] = useState<number | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await tmdb.getGenres('movie');
        setGenres(data.genres);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenreId) {
      const loadMoviesByGenre = async () => {
        setIsLoading(true);
        try {
          const data = await tmdb.getByGenre(selectedGenreId, 'movie');
          setMovies(data.results);
        } catch (error) {
          console.error('Error loading movies:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadMoviesByGenre();
    }
  }, [selectedGenreId]);

  const handleGenreClick = (genreId: number) => {
    setSelectedGenreId(genreId);
    setSearchParams({ genre: genreId.toString() });
  };

  const handleGenreTouchStart = (genreId: number) => {
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleGenreTouchEnd = () => {
    setTouchHoldId(null);
  };

  const selectedGenre = genres.find(g => g.id === selectedGenreId);

  const genreColors: { [key: number]: string } = {
    28: 'from-red-500/20 to-red-600/20 border-red-500/30',
    12: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    16: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    35: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
    80: 'from-green-500/20 to-green-600/20 border-green-500/30',
    99: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
    18: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
    10751: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
    14: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
    36: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    27: 'from-rose-500/20 to-rose-600/20 border-rose-500/30',
    10402: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    9648: 'from-sky-500/20 to-sky-600/20 border-sky-500/30',
    10749: 'from-fuchsia-500/20 to-fuchsia-600/20 border-fuchsia-500/30',
    878: 'from-lime-500/20 to-lime-600/20 border-lime-500/30',
    10770: 'from-teal-500/20 to-teal-600/20 border-teal-500/30',
    53: 'from-slate-500/20 to-slate-600/20 border-slate-500/30',
  };

  const selectedGenreColor = selectedGenreId ? genreColors[selectedGenreId] : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      {/* Hero Section */}
      <div className="relative pt-20 md:pt-24 pb-8 md:pb-12 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-56 md:w-96 h-56 md:h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-3 md:px-4 relative z-10">
          <div className="mb-6 md:mb-8">
            <div className="inline-block mb-3 md:mb-4">
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/20 rounded-full border border-primary/30">
                <span className="text-lg md:text-2xl">🎬</span>
                <span className="text-xs md:text-sm font-semibold text-accent">Browse Movies</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-400 mb-2 md:mb-4 text-foreground leading-tight">
              Discover by Genre
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-foreground/70 max-w-2xl">
              Explore thousands of movies organized by genre. Find your next favorite film today.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
        {/* Genre Filter */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-display font-400 mb-4 md:mb-6 text-foreground">All Genres</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                onTouchStart={() => handleGenreTouchStart(genre.id)}
                onTouchEnd={handleGenreTouchEnd}
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full font-medium transition-all duration-200 text-xs md:text-sm border active:scale-95 select-none ${
                  selectedGenreId === genre.id
                    ? `bg-gradient-to-r ${selectedGenreColor} border-accent shadow-lg scale-105`
                    : 'bg-muted/50 border-border/50 hover:bg-muted/70 hover:border-border active:bg-muted'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {selectedGenre && (
          <div className="space-y-6 md:space-y-8">
            {/* Results Header */}
            <div className={`premium-card bg-gradient-to-r ${selectedGenreColor} border-2 p-4 md:p-8 rounded-xl md:rounded-2xl`}>
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <div className="text-2xl md:text-4xl flex-shrink-0">🎭</div>
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-4xl font-display font-400 text-foreground truncate">
                    {selectedGenre.name}
                  </h2>
                  <p className="text-xs md:text-base text-foreground/70 mt-1">
                    {movies.length} {movies.length === 1 ? 'movie' : 'movies'} available
                  </p>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16 md:py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs md:text-base text-muted-foreground">Loading movies...</p>
                </div>
              </div>
            ) : movies.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 touch-auto">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group relative overflow-hidden rounded-lg md:rounded-xl transform transition-all duration-200 active:scale-95 hover:scale-105 tap-highlight-transparent"
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="premium-card text-center py-16 md:py-24 rounded-xl md:rounded-2xl">
                <Search className="h-12 md:h-16 w-12 md:w-16 text-muted-foreground/30 mx-auto mb-3 md:mb-4" />
                <p className="text-base md:text-xl text-muted-foreground">No movies found in this genre</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedGenreId && (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="premium-card w-full max-w-md text-center p-8 md:p-12 border-2 border-primary/20 rounded-xl md:rounded-2xl">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">👆</div>
              <h3 className="text-xl md:text-2xl font-display font-400 mb-2 md:mb-3 text-foreground">
                Select a Genre
              </h3>
              <p className="text-sm md:text-base text-foreground/70">
                Choose from the genres above to discover amazing movies tailored to your interests.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {selectedGenre && movies.length > 0 && (
        <div className="container mx-auto px-3 md:px-4 py-8 md:py-12 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="premium-card text-center p-4 md:p-6 rounded-lg md:rounded-xl transition-transform duration-200 active:scale-95 cursor-default">
              <div className="text-3xl md:text-4xl font-display font-400 text-accent mb-1 md:mb-2">
                {movies.length}
              </div>
              <p className="text-xs md:text-base text-muted-foreground">Movies in {selectedGenre.name}</p>
            </div>
            <div className="premium-card text-center p-4 md:p-6 rounded-lg md:rounded-xl transition-transform duration-200 active:scale-95 cursor-default">
              <div className="text-3xl md:text-4xl font-display font-400 text-accent mb-1 md:mb-2">
                ⭐
              </div>
              <p className="text-xs md:text-base text-muted-foreground">
                Avg Rating {(movies.reduce((sum, m) => sum + m.vote_average, 0) / movies.length).toFixed(1)}
              </p>
            </div>
            <div className="premium-card text-center p-4 md:p-6 rounded-lg md:rounded-xl transition-transform duration-200 active:scale-95 cursor-default">
              <div className="text-3xl md:text-4xl font-display font-400 text-accent mb-1 md:mb-2">
                🎬
              </div>
              <p className="text-xs md:text-base text-muted-foreground">All Top Picks</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresPage;