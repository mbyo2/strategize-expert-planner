
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colorScheme: string;
  setColorScheme: (colorScheme: string) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
}

const defaultContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  colorScheme: 'default',
  setColorScheme: () => {},
  fontFamily: 'default',
  setFontFamily: () => {},
  borderRadius: 0.5,
  setBorderRadius: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved preferences from localStorage
  const getSavedTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeMode) || 'system';
  };

  const getSavedColorScheme = (): string => {
    return localStorage.getItem('colorScheme') || 'default';
  };

  const getSavedFontFamily = (): string => {
    return localStorage.getItem('fontFamily') || 'default';
  };

  const getSavedBorderRadius = (): number => {
    const savedRadius = localStorage.getItem('borderRadius');
    return savedRadius ? parseFloat(savedRadius) : 0.5;
  };

  // State
  const [theme, setThemeState] = useState<ThemeMode>(getSavedTheme());
  const [colorScheme, setColorSchemeState] = useState<string>(getSavedColorScheme());
  const [fontFamily, setFontFamilyState] = useState<string>(getSavedFontFamily());
  const [borderRadius, setBorderRadiusState] = useState<number>(getSavedBorderRadius());

  // Update theme
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Update color scheme
  const setColorScheme = (newColorScheme: string) => {
    setColorSchemeState(newColorScheme);
    localStorage.setItem('colorScheme', newColorScheme);
  };

  // Update font family
  const setFontFamily = (newFontFamily: string) => {
    setFontFamilyState(newFontFamily);
    localStorage.setItem('fontFamily', newFontFamily);
  };

  // Update border radius
  const setBorderRadius = (newRadius: number) => {
    setBorderRadiusState(newRadius);
    localStorage.setItem('borderRadius', newRadius.toString());
  };

  // Apply system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial setup
    if (theme === 'system') {
      handleChange();
    }
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        colorScheme, 
        setColorScheme,
        fontFamily,
        setFontFamily,
        borderRadius,
        setBorderRadius
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default useTheme;
