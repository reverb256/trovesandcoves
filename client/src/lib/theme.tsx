import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'trovesandcoves-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage, default to light mode
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Default to light mode
    return 'light';
  });

  useEffect(() => {
    // Prevent unnecessary DOM updates if theme hasn't changed
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === theme) {
      return;
    }

    // Update localStorage when theme changes
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update document class for CSS targeting
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
