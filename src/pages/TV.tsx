import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { MovieCard } from '@/components/MovieCard';
import { tmdb, type Movie } from '@/services/tmdb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TVPage = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [trendingData, popularData, topRatedData] = await Promise.all([
        tmdb.getTrending('tv', 'week'),
        tmdb.getPopular('tv'),
        tmdb.getTopRated('tv'),
      ]);
      setTrending(trendingData.results);
      setPopular(popularData.results);
      setTopRated(topRatedData.results);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <div className="pt-24 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          📺 TV Shows
        </h1>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="mb-8 glass-card border-white/10">
            <TabsTrigger value="trending" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Trending</TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Popular</TabsTrigger>
            <TabsTrigger value="top-rated" className="data-[state=active]:gradient-primary data-[state=active]:text-white">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((show) => (
                <MovieCard key={show.id} movie={show} type="tv" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popular.map((show) => (
                <MovieCard key={show.id} movie={show} type="tv" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top-rated">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topRated.map((show) => (
                <MovieCard key={show.id} movie={show} type="tv" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TVPage;
