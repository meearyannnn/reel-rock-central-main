import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { tmdb, type Movie } from '@/services/tmdb';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const data = await tmdb.search(searchQuery);
    setResults(data.results);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <div className="pt-24 container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            🔍 Discover Your Next Favorite
          </h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
            <Input
              type="text"
              placeholder="Search for movies, TV shows..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-14 h-14 text-lg glass-card border-white/20 focus:border-primary/50 transition-all duration-300 focus:shadow-glow"
            />
          </div>
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results ({results.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-xl">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
