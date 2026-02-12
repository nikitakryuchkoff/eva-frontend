import { useClientStore } from '@/shared/store';
import { useEffect } from 'react';

export const useMobile = () => {
  useEffect(() => {
    const detectMobile = () => {
      const isMobile = window.matchMedia('(max-width: 480px)').matches;
      useClientStore.getState().setMobile(isMobile);
    };

    detectMobile();
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);
};
