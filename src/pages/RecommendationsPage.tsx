import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { MovieCard } from '@/components/MovieCard';
import { searchMoviesByMood, type RecommendedMovie } from '@/services/aiRecommender';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';

interface Preset {
  icon: string;
  label: string;
  query: string;
}

const presets: Preset[] = [
  { icon: '😢', label: 'Sad Movies', query: 'sad movies' },
  { icon: '😂', label: 'Comedy', query: 'funny comedy movies' },
  { icon: '🎬', label: 'Action', query: 'action packed movies' },
  { icon: '🌙', label: 'Night Vibes', query: 'dark mysterious movies' },
  { icon: '💕', label: 'Romance', query: 'romantic love movies' },
  { icon: '🚀', label: 'Sci-Fi', query: 'science fiction movies' },
  { icon: '🔪', label: 'Thriller', query: 'thriller suspense movies' },
  { icon: '🎭', label: 'Drama', query: 'emotional drama movies' },
];

export const RecommendationsPage = () => {
  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSelectedPreset(null);
    try {
      const results = await searchMoviesByMood(query);
      setMovies(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = async (query: string, label: string) => {
    setSelectedPreset(label);
    setSearchQuery(label);
    await handleSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent">AI Powered</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-400 mb-4 text-foreground leading-tight">
              Find Your Next Favorite
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Describe your mood, vibe, or what you're looking for. Our AI will find the perfect movie for you.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8">
            <div className="flex gap-3 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter mood, genre, or movie description..."
                className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Preset Moods */}
        {movies.length === 0 && !isLoading && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-400 mb-6 text-foreground">
              Popular Moods
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.query, preset.label)}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted/80 border border-border/50 hover:border-primary/50 transition-all duration-300 text-left group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </div>
                  <p className="font-medium text-foreground">{preset.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">Finding perfect movies for you...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {movies.length > 0 && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display font-400 text-foreground">
                Recommended for: <span className="text-accent">{selectedPreset || searchQuery}</span>
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setMovies([]);
                  setSearchQuery('');
                  setSelectedPreset(null);
                }}
              >
                New Search
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="premium-card p-4 rounded-2xl hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-muted">
                    {movie.image_url ? (
                      <img
                        src={movie.image_url}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-400 text-sm line-clamp-2 mb-2">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">{movie.genre}</span>
                    <span className="text-sm font-semibold text-accent flex-shrink-0 ml-2">
                      ⭐ {movie.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-2">
                    {movie.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {movies.length === 0 && !isLoading && searchQuery && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="premium-card w-full max-w-md text-center p-12">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No movies found. Try a different search!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;