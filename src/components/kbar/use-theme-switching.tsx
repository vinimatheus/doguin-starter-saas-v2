import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: 'Alternar Tema',
      shortcut: ['t', 't'],
      section: 'Tema',
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: 'Definir Tema Claro',
      section: 'Tema',
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: 'Definir Tema Escuro',
      section: 'Tema',
      perform: () => setTheme('dark')
    }
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
