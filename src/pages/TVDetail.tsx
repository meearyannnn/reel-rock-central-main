import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Heart, Bookmark, Download, Play, X, Youtube } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { tmdb, type MovieDetail, type Episode, type Season, type CastMember } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface TVShowDetail extends MovieDetail {
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

const TVDetailPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState<TVShowDetail | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSource, setSelectedSource] = useState<VideoSource>(videoSources[0]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const checkUserLists = async () => {
      if (!userId || !id) return;
      try {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('show_id', id)
          .single();
        setIsFavorite(!!favData);

        const { data: watchData } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', userId)
          .eq('show_id', id)
          .single();
        setIsWatchlist(!!watchData);
      } catch (error) {
        console.log('Error checking lists:', error);
      }
    };
    checkUserLists();
  }, [userId, id]);

  useEffect(() => {
    const loadShow = async () => {
      if (!id) return;
      try {
        const data = await tmdb.getDetails(parseInt(id), 'tv');
        setShow(data as TVShowDetail);

        const videosData = await tmdb.getVideos(parseInt(id), 'tv');
        setVideos(videosData.results || []);

        const officialTrailer = videosData.results?.find(
          (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailer(officialTrailer || null);

        const creditsData = await tmdb.getCredits(parseInt(id), 'tv');
        setCast(creditsData.cast?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error loading show:', error);
      }
    };
    loadShow();
  }, [id]);

  useEffect(() => {
    const loadEpisodes = async () => {
      if (!id) return;
      try {
        const data = await tmdb.getSeasonDetails(parseInt(id), selectedSeason);
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error('Error loading episodes:', error);
      }
    };
    loadEpisodes();
  }, [id, selectedSeason]);

  const toggleFavorite = async () => {
    if (!userId || !id || !show) return;
    setIsLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('show_id', id);
      } else {
        await supabase.from('favorites').insert({
          user_id: userId,
          show_id: id,
          title: show.name,
          poster_path: show.poster_path,
          type: 'tv',
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    if (!userId || !id || !show) return;
    setIsLoading(true);
    try {
      if (isWatchlist) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('show_id', id);
      } else {
        await supabase.from('watchlist').insert({
          user_id: userId,
          show_id: id,
          title: show.name,
          poster_path: show.poster_path,
          type: 'tv',
        });
      }
      setIsWatchlist(!isWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (action: () => void) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    action();
  };

  if (!show) return null;

  const playEpisode = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
  };

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
                src={selectedSource.getTvUrl(show.id, selectedSeason, selectedEpisode)}
                className="w-full h-full"
                allowFullScreen
                title={show.name}
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
                backgroundImage: `url(${tmdb.getImageUrl(show.backdrop_path, 'original')})`,
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
                    src={tmdb.getImageUrl(show.poster_path, 'w500')}
                    alt={show.name}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-3 md:space-y-6">
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-6xl font-display font-400 mb-2 md:mb-4 text-foreground line-clamp-2">
                    {show.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm mb-3 md:mb-6">
                    {show.first_air_date && (
                      <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-muted/50 rounded-lg backdrop-blur">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        <span>{new Date(show.first_air_date).getFullYear()}</span>
                      </div>
                    )}
                    {show.number_of_seasons && (
                      <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-muted/50 rounded-lg backdrop-blur">
                        <Play className="h-3 w-3 md:h-4 md:w-4 text-accent flex-shrink-0" />
                        <span className="whitespace-nowrap">{show.number_of_seasons}S</span>
                      </div>
                    )}
                    {show.vote_average && (
                      <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-primary/20 rounded-lg border border-primary/30">
                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-accent text-accent flex-shrink-0" />
                        <span className="font-semibold text-xs md:text-sm">{show.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {show.genres && show.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-6">
                      {show.genres.slice(0, 3).map((genre) => (
                        <Badge key={genre.id} variant="secondary" className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs md:text-base text-foreground/80 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                  {show.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4">
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-6 active:scale-95 transition-transform duration-200"
                    onClick={() => handleButtonClick(() => playEpisode(1))}
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
                    onClick={() => handleButtonClick(toggleFavorite)}
                    disabled={isLoading || !userId}
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
                    onClick={() => handleButtonClick(toggleWatchlist)}
                    disabled={isLoading || !userId}
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
            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="mb-4 md:mb-8 bg-muted/50 border border-border/50 backdrop-blur w-full justify-start overflow-x-auto">
                <TabsTrigger value="episodes" className="text-xs md:text-sm">Episodes</TabsTrigger>
                <TabsTrigger value="cast" className="text-xs md:text-sm">Cast</TabsTrigger>
                <TabsTrigger value="about" className="text-xs md:text-sm">About</TabsTrigger>
              </TabsList>

              {/* Episodes Tab */}
              <TabsContent value="episodes" className="space-y-3 md:space-y-6">
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl md:text-3xl font-display font-400">Episodes</h2>
                  <Select value={String(selectedSeason)} onValueChange={(v) => setSelectedSeason(parseInt(v))}>
                    <SelectTrigger className="w-full md:w-[200px] text-xs md:text-sm">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      {show.seasons?.filter((s) => s.season_number > 0).map((season: Season) => (
                        <SelectItem key={season.id} value={String(season.season_number)}>
                          Season {season.season_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:space-y-4">
                  {episodes.length > 0 ? (
                    episodes.map((episode: Episode) => (
                      <div key={episode.id} className="premium-card p-0 overflow-hidden hover:shadow-lg transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-[160px,1fr,auto] gap-2 md:gap-4 p-2 md:p-4">
                          {/* Episode Thumbnail */}
                          <div className="relative rounded-lg md:rounded-xl overflow-hidden bg-muted h-[90px] md:h-[140px] flex-shrink-0">
                            {episode.still_path ? (
                              <img
                                src={tmdb.getImageUrl(episode.still_path, 'w300')}
                                alt={episode.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="h-6 md:h-12 w-6 md:w-12 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          {/* Episode Info */}
                          <div className="flex flex-col justify-center space-y-1.5 md:space-y-3 min-w-0">
                            <div>
                              <h3 className="text-xs md:text-xl font-display font-400 mb-0.5 md:mb-1 truncate md:truncate-none">
                                Ep. {episode.episode_number}: {episode.name}
                              </h3>
                              {episode.air_date && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-2.5 w-2.5 md:h-4 md:w-4 flex-shrink-0" />
                                  <span>
                                    {new Date(episode.air_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-foreground/75 line-clamp-1 md:line-clamp-2 text-xs md:text-sm leading-relaxed hidden xs:block">
                              {episode.overview || 'No description available'}
                            </p>
                          </div>

                          {/* Episode Actions */}
                          <div className="flex flex-col justify-center items-end gap-1.5 md:gap-3 flex-shrink-0">
                            {episode.vote_average && (
                              <div className="flex items-center gap-0.5 px-2 py-0.5 md:px-3 md:py-1.5 bg-primary/20 rounded-lg border border-primary/30 text-xs md:text-sm">
                                <Star className="h-2.5 w-2.5 md:h-4 md:w-4 fill-accent text-accent" />
                                <span className="font-semibold">{episode.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 gap-1 text-xs md:text-sm px-2 md:px-4 active:scale-95 transition-transform duration-200"
                              onClick={() => handleButtonClick(() => playEpisode(episode.episode_number))}
                            >
                              <Play className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="hidden sm:inline">Play</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="premium-card text-center py-8 md:py-12">
                      <p className="text-xs md:text-base text-muted-foreground">No episodes available for this season</p>
                    </div>
                  )}
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

              {/* About Tab */}
              <TabsContent value="about" className="space-y-4 md:space-y-8">
                <div className="premium-card p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">About This Show</h3>
                  <p className="text-foreground/80 leading-relaxed text-xs md:text-lg">
                    {show.overview}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-8">
                  {/* Show Information */}
                  <div className="premium-card p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">Show Information</h3>
                    <div className="space-y-2 md:space-y-4">
                      {show.first_air_date && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">First Air Date</span>
                          <span className="font-medium text-foreground text-right">
                            {new Date(show.first_air_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {show.number_of_seasons && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Total Seasons</span>
                          <span className="font-medium text-foreground">{show.number_of_seasons}</span>
                        </div>
                      )}
                      {show.number_of_episodes && (
                        <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/50 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Total Episodes</span>
                          <span className="font-medium text-foreground">{show.number_of_episodes}</span>
                        </div>
                      )}
                      {show.vote_average && (
                        <div className="flex justify-between items-center py-2 md:py-3 text-xs md:text-base gap-2">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-accent text-accent" />
                            {show.vote_average.toFixed(1)}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="premium-card p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-display font-400 mb-3 md:mb-6">Genres</h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {show.genres?.map((genre) => (
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
              className="absolute -top-10 md:-top-14 right-2 md:right-0 p-1.5 md:p-2.5 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group active:scale-95 z-10"
            >
              <X className="h-4 w-4 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="w-full aspect-video bg-black rounded-lg md:rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                className="w-full h-full"
                allowFullScreen
                title="Show Trailer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVDetailPage;