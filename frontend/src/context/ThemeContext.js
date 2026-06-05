import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
      <style>{`
        :root {
          --bg-page: #e8e0d0;
          --bg-paper: #faf6ef;
          --border-paper: #e8e0d0;
          --text-primary: #2c3e50;
          --text-secondary: #5a4e3e;
          --text-muted: #b0a090;
          --accent: #c9a96e;
          --card-bg: #fff;
          --shadow: rgba(0,0,0,0.08);
        }
        [data-theme="dark"] {
          --bg-page: #1a1a2e;
          --bg-paper: #252540;
          --border-paper: #3a3a5c;
          --text-primary: #e8e0d0;
          --text-secondary: #c4b8a8;
          --text-muted: #8a7a8a;
          --accent: #b8965e;
          --card-bg: #2e2e48;
          --shadow: rgba(0,0,0,0.3);
        }
        body {
          margin: 0;
          padding: 0;
          background: var(--bg-page);
          color: var(--text-primary);
          min-height: 100vh;
        }
      `}</style>
    </ThemeContext.Provider>
  );
}
