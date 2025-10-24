import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={() => navigate(-1)}
      className="fixed top-20 left-4 z-50 hover:scale-110 transition-all duration-300"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};
