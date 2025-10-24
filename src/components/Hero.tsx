import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tmdb, type Movie } from '@/services/tmdb';

export const Hero = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  const navigate = useNavigate();
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await tmdb.getTrending('movie', 'week');
      setMovies(data.results.slice(0, 8));
    };
    loadMovies();
  }, []);

  useEffect(() => {
    if (!isAutoPlay || movies.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, movies.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => setIsAutoPlay(true), 10000) as unknown as NodeJS.Timeout;
  };

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlay(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => setIsAutoPlay(true), 10000) as unknown as NodeJS.Timeout;
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlay(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => setIsAutoPlay(true), 10000) as unknown as NodeJS.Timeout;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
    setIsTouching(true);
    
    // Haptic feedback on touch start
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const touchTime = Date.now() - touchStartTimeRef.current;
    const diff = touchStartRef.current - touchEnd;
    const absDiff = Math.abs(diff);

    setIsTouching(false);

    // Detect swipe: minimum 30px distance and quick movement (< 500ms)
    if (absDiff > 30 && touchTime < 500) {
      // Haptic feedback on swipe
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }

      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  const handleButtonClick = (action: () => void) => {
    // Haptic feedback on button click
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    action();
  };

  if (movies.length === 0) return null;

  const featured = movies[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden group bg-background"
      style={{ height: 'max(85vh, 500px)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
          isTouching ? '' : ''
        }`}
        style={{
          backgroundImage: `url(${tmdb.getImageUrl(featured.backdrop_path, 'original')})`,
        }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-3 md:px-4 flex flex-col justify-end pb-12 md:pb-20 animate-fade-in">
        {/* Trending Badge */}
        <div className="inline-block glass-card px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4 w-fit animate-float">
          <span className="text-accent font-bold flex items-center gap-2 text-xs md:text-sm">
            🔥 Trending Now
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-5xl lg:text-7xl xl:text-8xl font-display font-400 mb-3 md:mb-6 max-w-4xl text-foreground drop-shadow-2xl leading-tight">
          {featured.title || featured.name}
        </h1>

        {/* Description */}
        <p className="text-xs md:text-base lg:text-lg text-foreground/85 mb-6 md:mb-8 max-w-2xl line-clamp-2 md:line-clamp-3 leading-relaxed font-body">
          {featured.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 flex-wrap">
          <Button
            size="sm"
            onClick={() => handleButtonClick(() => navigate(`/movie/${featured.id}`))}
            className="gap-2 text-xs md:text-base px-4 md:px-8 py-2 md:py-3 bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 transition-transform duration-200"
          >
            <Play className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden xs:inline">Play Now</span>
            <span className="xs:hidden">Play</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleButtonClick(() => navigate(`/movie/${featured.id}`))}
            className="gap-2 text-xs md:text-base px-4 md:px-8 py-2 md:py-3 border-border hover:bg-muted/50 active:scale-95 transition-transform duration-200"
          >
            <Info className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden xs:inline">More Info</span>
            <span className="xs:hidden">Info</span>
          </Button>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          {/* Previous Button - Hidden on mobile, show on hover/desktop */}
          <button
            onClick={() => handleButtonClick(handlePrevSlide)}
            className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 p-2 rounded-full border border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 active:scale-95"
            aria-label="Previous movie"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Dot Indicators - Scrollable on mobile */}
          <div className="flex gap-1 md:gap-2 flex-1 md:flex-none overflow-x-auto touch-pan-x">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(() => goToSlide(index))}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-200 active:scale-125 flex-shrink-0 ${
                  index === currentIndex
                    ? 'w-6 md:w-8 bg-accent'
                    : 'w-1.5 md:w-2 bg-foreground/30 hover:bg-foreground/50 active:bg-foreground/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button - Hidden on mobile, show on hover/desktop */}
          <button
            onClick={() => handleButtonClick(handleNextSlide)}
            className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 p-2 rounded-full border border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 active:scale-95"
            aria-label="Next movie"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Autoplay Toggle - Smaller on mobile */}
          <button
            onClick={() => handleButtonClick(() => setIsAutoPlay(!isAutoPlay))}
            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border transition-all duration-200 active:scale-95 flex-shrink-0 hidden md:block md:opacity-0 md:group-hover:opacity-100 ${
              isAutoPlay
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border/50 hover:bg-muted/50'
            }`}
          >
            {isAutoPlay ? '⏸' : '▶'}
          </button>
        </div>

        {/* Touch Hint - Mobile only */}
        <div className="md:hidden text-center mt-6 text-foreground/50 text-xs">
          Swipe to change movie
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-foreground/10">
        <div
          className="h-full bg-accent transition-all ease-linear"
          style={{
            width: `${((currentIndex + 1) / movies.length) * 100}%`,
            transitionDuration: isAutoPlay ? '6s' : '0.5s',
          }}
        />
      </div>
    </div>
  );
};