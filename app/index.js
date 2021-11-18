import React from 'react';
import {AppRegistry} from 'react-native';
import Home from './src/pages/Home';
import { fonts } from './src/styles/theme.json'
import {name as appName} from './app.json';
import { Provider as StoreProviver } from 'react-redux';
import { DefaultTheme, configureFonts , Provider as PaperProvider } from 'react-native-paper';
import store from './src/store';

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({
    ios: fonts,
    android: fonts,
  })
};





const App = () =>{
  return(
    <StoreProviver store={store}>
        <PaperProvider theme={theme}>
          <Home />
        </PaperProvider>  
    </StoreProviver>
    
    
    
  )
}

AppRegistry.registerComponent(appName, () => App);
