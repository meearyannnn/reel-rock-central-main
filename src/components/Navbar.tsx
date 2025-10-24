import { Link, useLocation } from 'react-router-dom';
import { Search, Film, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/movies', label: 'Movies' },
    { path: '/tv', label: 'TV Shows' },
    { path: '/genres', label: 'Genres' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/80 backdrop-blur-xl border-b border-border/30" />
      
      {/* Content */}
      <div className="relative container mx-auto px-3 md:px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform duration-300 group flex-shrink-0"
        >
          <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Film className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <span className="hidden sm:inline text-lg md:text-xl font-display font-400 bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
            Movie Guy
          </span>
          <span className="sm:hidden text-base md:text-xl font-display font-400 bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
            MG
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-muted/20 border border-border/30 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Desktop Search Button */}
        <Link to="/search" className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-lg transition-all duration-300 ${
              isActive('/search')
                ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Search className="h-5 w-5" />
          </Button>
        </Link>

        {/* Mobile Menu Toggle & Search */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/search" className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg transition-all duration-300 h-9 w-9 ${
                isActive('/search')
                  ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-300 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/30 animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto px-3 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={handleNavClick}>
                <button
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </nav>
  );
};