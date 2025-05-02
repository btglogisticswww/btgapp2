import { useEffect } from 'react';

export function useGoogleFont(fontFamily: string, weights: string[] = ['300', '400', '500', '600', '700']): string {
  useEffect(() => {
    // Check if the font is already loaded
    const linkExists = document.querySelector(`link[href*="${fontFamily}"]`);
    if (linkExists) return;

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@${weights.join(';')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Clean up
    return () => {
      // Only remove if we're the only one using this font
      const otherLinks = document.querySelectorAll(`link[href*="${fontFamily}"]`);
      if (otherLinks.length === 1) {
        document.head.removeChild(link);
      }
    };
  }, [fontFamily, weights.join(',')]);

  return fontFamily;
}
