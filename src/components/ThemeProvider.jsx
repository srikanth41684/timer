import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';

const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
};

const darkTheme = {
  background: '#000000',
  text: '#FFFFFF',
};

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    console.log('ThemeProvider-theme=====>', theme);

    AsyncStorage.getItem('theme').then(theme => {
      if (theme) {
        setTheme(theme === 'dark' ? darkTheme : lightTheme);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === darkTheme ? lightTheme : darkTheme;
    setTheme(newTheme);
    AsyncStorage.setItem('theme', theme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
