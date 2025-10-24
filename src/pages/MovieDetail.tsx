import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Clock, Heart, Bookmark, Download, Play, X, Youtube } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { tmdb, type MovieDetail, type CastMember } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingsDisplay } from '@/components/RatingsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoSourceSelector } from '@/components/VideoSourceSelector';
import { videoSources, type VideoSource } from '@/types/videoSources';

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSource, setSelectedSource] = useState<VideoSource>(videoSources[0]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      try {
        const data = await tmdb.getDetails(parseInt(id), 'movie');
        setMovie(data);

        const videosData = await tmdb.getVideos(parseInt(id), 'movie');

        const officialTrailer = videosData.results?.find(
          (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailer(officialTrailer || null);

        const creditsData = await tmdb.getCredits(parseInt(id), 'movie');
        setCast(creditsData.cast?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error loading movie:', error);
      }
    };
    loadMovie();
  }, [id]);

  const handleButtonClick = (action: () => void) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    action();
  };

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      {showPlayer ? (
        <div className="pt-16 md:pt-20">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-6">
            <VideoSourceSelector
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
            />
            <div className="w-full aspect-video bg-black rounded-lg md:rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={selectedSource.getMovieUrl(movie.id)}
                className="w-full h-full"
                allowFullScreen
                title={movie.title}
              />
            </div>
            <Button 
              onClick={() => setShowPlayer(false)} 
              variant="outline"
              size="sm"
              className="w-full md:w-auto active:scale-95 transition-transform duration-200"
            >
              ← Back to Details
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-16 md:pt-20">
          {/* Hero Section with Backdrop */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${tmdb.getImageUrl(movie.backdrop_path, 'original')})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-3 md:px-4 -mt-16 md:-mt-32 relative z-10 pb-6 md:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] lg:grid-cols-[280px,1fr] gap-4 md:gap-8">
              {/* Poster */}
              <div className="flex justify-center md:justify-start">
                <div className="shadow-2xl rounded-lg md:rounded-2xl overflow-hidden transform hover:scale-105 transition-smooth w-full max-w-[150px] md:max-w-[220px] lg:max-w-[280px]">
                  <img
                    src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-3 md:space-y-6">
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-6xl font-display font-400 mb-2 md:mb-4 text-foreground line-clamp-2">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm mb-3 md:mb-6">
                    {movie.release_date && (
                      <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-muted/50 rounded-lg backdrop-blur">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    )}
                    {movie.runtime && (
                      <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-muted/50 rounded-lg backdrop-blur">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        <span>{movie.runtime}m</span>
                      </div>
                    )}
                    {movie.vote_average && (
                      <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-primary/20 rounded-lg border border-primary/30">
                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-accent text-accent flex-shrink-0" />
                        <span className="font-semibold text-xs md:text-sm">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-6">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <Badge key={genre.id} variant="secondary" className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs md:text-base text-foreground/80 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4">
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-6 active:scale-95 transition-transform duration-200"
                    onClick={() => handleButtonClick(() => setShowPlayer(true))}
                  >
                    <Play className="h-4 w-4" />
                    <span className="hidden xs:inline">Watch Now</span>
                    <span className="xs:hidden">Watch</span>
                  </Button>
                  {trailer && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 md:gap-2 border-accent/50 hover:bg-accent/10 text-xs md:text-sm px-2 md:px-6 active:scale-95 transition-transform duration-200"
                      onClick={() => handleButtonClick(() => setShowTrailer(true))}
                    >
                      <Youtube className="h-4 w-4" />
                      <span className="hidden xs:inline">Trailer</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className={`gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-6 active:scale-95 transition-all duration-200 ${
                      isFavorite
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => handleButtonClick(() => setIsFavorite(!isFavorite))}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isFavorite ? 'Fav' : 'Fav'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-6 active:scale-95 transition-all duration-200 ${
                      isWatchlist
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => handleButtonClick(() => setIsWatchlist(!isWatchlist))}
                  >
                    <Bookmark className={`h-4 w-4 ${isWatchlist ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isWatchlist ? 'List' : 'List'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="container mx-auto px-3 md:px-4 py-6 md:py-12">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-4 md:mb-8 bg-muted/50 border border-border/50 backdrop-blur w-full justify-start overflow-x-auto">
                <TabsTrigger value="about" className="text-xs md:text-sm">About</TabsTrigger>
                <TabsTrigger value="cast" className="text-xs md:text-sm">Cast</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-4 md:space-y-8">
                <div className="premium-card p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">About This Movie</h3>
                  <p className="text-foreground/80 leading-relaxed text-xs md:text-lg">
                    {movie.overview}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-8">
                  {/* Movie Information */}
                  <div className="premium-card p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">Movie Information</h3>
                    <div className="space-y-2 md:space-y-4">
                      {movie.release_date && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Release Date</span>
                          <span className="font-medium text-foreground text-right">
                            {new Date(movie.release_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {movie.runtime && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Runtime</span>
                          <span className="font-medium text-foreground">{movie.runtime}m</span>
                        </div>
                      )}
                      {movie.vote_average && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-accent text-accent" />
                            {movie.vote_average.toFixed(1)}/10
                          </span>
                        </div>
                      )}
                      {movie.budget && movie.budget > 0 && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-medium text-foreground">${(movie.budget / 1000000).toFixed(1)}M</span>
                        </div>
                      )}
                      {movie.revenue && movie.revenue > 0 && (
                        <div className="flex justify-between items-center py-2 md:py-3 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-medium text-foreground">${(movie.revenue / 1000000).toFixed(1)}M</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="premium-card p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">Genres</h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {movie.genres?.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="secondary"
                          className="px-2 md:px-4 py-0.5 md:py-2 text-xs md:text-sm"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Cast Tab */}
              <TabsContent value="cast" className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-3xl font-display font-400">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                  {cast.map((member) => (
                    <div key={member.id} className="space-y-2 md:space-y-3">
                      <div className="relative aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden bg-muted shadow-lg hover:scale-105 transition-transform">
                        {member.profile_path ? (
                          <img
                            src={tmdb.getImageUrl(member.profile_path, 'w185')}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-2xl md:text-4xl text-muted-foreground/30">👤</div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 md:space-y-1 min-w-0">
                        <p className="font-semibold text-foreground line-clamp-1 text-xs md:text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 md:-top-12 right-2 md:right-0 p-1.5 md:p-2 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group active:scale-95 z-10"
            >
              <X className="h-4 w-4 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div className="w-full aspect-video bg-black rounded-lg md:rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                className="w-full h-full"
                allowFullScreen
                title="Movie Trailer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;