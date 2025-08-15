import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />;
  }
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff' }]} />;
}
