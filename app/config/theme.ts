import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    secondary: '#FFC107',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    placeholder: '#888888',
  },
  roundness: 10,
};
