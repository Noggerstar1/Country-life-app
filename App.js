import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/tabNavigator';
import { StatusBar } from 'react-native';


export default function App() {
  const MyTheme = {
    dark: false,
    colors: {
    primary: 'rgb(0, 122, 255)',
    background: '#154734ee',
    card: '#154734',
    text: 'rgb(255, 255, 255)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
    },
  };
  
  return (

    <NavigationContainer theme={MyTheme}>
      <StatusBar
        animated={true}
        backgroundColor="#154734dd"
        
      />
      <TabNavigator />
    </NavigationContainer>
    
  );
}