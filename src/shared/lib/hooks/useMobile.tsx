import { useEffect } from 'react';

import { useClientStore } from '@/shared/store';

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
