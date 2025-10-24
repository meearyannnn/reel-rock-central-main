import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { MovieCard } from '@/components/MovieCard';
import { tmdb, type Movie, type Genre } from '@/services/tmdb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MoviesPage = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [trendingData, popularData, topRatedData, genresData] = await Promise.all([
        tmdb.getTrending('movie', 'week'),
        tmdb.getPopular('movie'),
        tmdb.getTopRated('movie'),
        tmdb.getGenres('movie'),
      ]);
      setTrending(trendingData.results);
      setPopular(popularData.results);
      setTopRated(topRatedData.results);
      setGenres(genresData.genres);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <div className="pt-24 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          🎬 Movies
        </h1>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="mb-8 glass-card border-white/10">
            <TabsTrigger value="trending" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Trending</TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Popular</TabsTrigger>
            <TabsTrigger value="top-rated" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popular.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top-rated">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topRated.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoviesPage;
