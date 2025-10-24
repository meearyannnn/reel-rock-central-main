import { Hero } from '@/components/Hero';
import { MovieRow } from '@/components/MovieRow';
import { Navbar } from '@/components/Navbar';
import { tmdb, type Movie } from '@/services/tmdb';

const Home = () => {
  // Custom fetch for airing today (TV Shows)
  const getAiringToday = async () => {
    const data = await tmdb.getTrending('tv', 'day');
    // Filter and sort by most recent air date
    const airingToday = data.results
      ?.filter((show: Movie) => show.first_air_date)
      .slice(0, 10) || [];
    return { results: airingToday };
  };

  // Custom fetch for upcoming movies
  const getUpcomingMovies = async () => {
    const data = await tmdb.getPopular('movie');
    return { results: data.results?.slice(0, 10) || [] };
  };

  // Custom fetch for top rated by genre
  const getActionMovies = async () => {
    return tmdb.getByGenre(28, 'movie'); // 28 is Action genre ID
  };

  const getDramaMovies = async () => {
    return tmdb.getByGenre(18, 'movie'); // 18 is Drama genre ID
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <div className="py-8">
          {/* Trending Section */}
          <MovieRow
            title="Trending Now"
            fetchData={() => tmdb.getTrending('movie', 'week')}
          />

          {/* Airing Today */}
          <MovieRow
            title="Airing Today"
            fetchData={getAiringToday}
            type="tv"
          />

          {/* Popular Movies */}
          <MovieRow
            title="Popular Movies"
            fetchData={() => tmdb.getPopular('movie')}
          />

          {/* Top Rated Movies */}
          <MovieRow
            title="Top Rated Movies"
            fetchData={() => tmdb.getTopRated('movie')}
          />

          {/* Action Movies */}
          <MovieRow
            title="Action Movies"
            fetchData={getActionMovies}
          />

          {/* Drama Movies */}
          <MovieRow
            title="Drama Movies"
            fetchData={getDramaMovies}
          />

          {/* Popular TV Shows */}
          <MovieRow
            title="Popular TV Shows"
            fetchData={() => tmdb.getPopular('tv')}
            type="tv"
          />

          {/* Top Rated TV Shows */}
          <MovieRow
            title="Top Rated TV Shows"
            fetchData={() => tmdb.getTopRated('tv')}
            type="tv"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;