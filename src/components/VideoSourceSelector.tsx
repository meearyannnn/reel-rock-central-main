import { videoSources, type VideoSource } from '@/types/videoSources';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface VideoSourceSelectorProps {
  selectedSource: VideoSource;
  onSourceChange: (source: VideoSource) => void;
}

export const VideoSourceSelector = ({ selectedSource, onSourceChange }: VideoSourceSelectorProps) => {
  const handleSourceChange = (source: VideoSource) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSourceChange(source);
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-xl border border-border">
      <div className="mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Video Sources</h3>
        <p className="text-xs md:text-sm text-muted-foreground">Select your preferred streaming source</p>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {videoSources.map((source) => (
          <Button
            key={source.id}
            variant={selectedSource.id === source.id ? 'default' : 'outline'}
            className={`h-auto py-3 px-4 justify-start text-left transition-all duration-200 active:scale-95 ${
              selectedSource.id === source.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'hover:bg-accent/50 hover:text-accent-foreground border-border hover:border-accent'
            }`}
            onClick={() => handleSourceChange(source)}
          >
            <div className="flex flex-col items-start gap-1 w-full min-w-0">
              <span className="font-medium text-sm truncate">{source.name}</span>
              {selectedSource.id === source.id && (
                <span className="text-xs opacity-80 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
                  Active
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Layout */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-border/50 bg-muted/20">
          <div className="flex gap-2 p-2">
            {videoSources.map((source) => (
              <Button
                key={source.id}
                variant={selectedSource.id === source.id ? 'default' : 'outline'}
                className={`min-w-fit h-auto py-2.5 px-3 justify-start text-left transition-all duration-200 active:scale-95 flex-shrink-0 ${
                  selectedSource.id === source.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'hover:bg-accent/50 hover:text-accent-foreground border-border hover:border-accent'
                }`}
                onClick={() => handleSourceChange(source)}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-medium text-xs md:text-sm">{source.name}</span>
                  {selectedSource.id === source.id && (
                    <span className="text-xs opacity-80 flex items-center gap-0.5">
                      <span className="inline-block w-1 h-1 rounded-full bg-current"></span>
                      Active
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>
    </div>
  );
};