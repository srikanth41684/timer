import {Appearance, PermissionsAndroid, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import GlobalStackNavigator from './src/navigation/GlobalStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppThemeContext} from './src/context/AppThemeContext';

const App = () => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    themeHandler();
    requestPermissions();
  }, []);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
        console.log('error===========>', error);
        
      }
    }
  }

  const themeHandler = async () => {
    AsyncStorage.getItem('theme')
      .then(value => {
        if (value) {
          setTheme(value);
          AsyncStorage.setItem('theme', value);
        } else {
          AsyncStorage.setItem('theme', Appearance.getColorScheme());
          setTheme(Appearance.getColorScheme());
        }
      })
      .catch(error => console.error('Error retrieving theme:', error));
  };

  return (
    <AppThemeContext.Provider value={{theme, setTheme}}>
      <NavigationContainer>
        <GlobalStackNavigator />
      </NavigationContainer>
    </AppThemeContext.Provider>
  );
};

export default App;
