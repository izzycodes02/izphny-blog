'use client';

import { useEffect, useState } from 'react';

export function useIsMd() {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const listener = () => setIsMd(media.matches);

    listener(); // set initial
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  return isMd;
}
