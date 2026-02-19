import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    // Update document class for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      // Background colors
      bg: {
        primary: isDark ? 'bg-gray-900' : 'bg-gray-50',
        secondary: isDark ? 'bg-gray-800' : 'bg-white',
        tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
      },
      // Text colors
      text: {
        primary: isDark ? 'text-white' : 'text-gray-900',
        secondary: isDark ? 'text-gray-300' : 'text-gray-600',
        tertiary: isDark ? 'text-gray-400' : 'text-gray-500',
      },
      // Border colors
      border: {
        primary: isDark ? 'border-gray-700' : 'border-gray-200',
        secondary: isDark ? 'border-gray-600' : 'border-gray-300',
      },
      // Interactive elements
      interactive: {
        hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        active: isDark ? 'bg-gray-600' : 'bg-gray-200',
      }
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}