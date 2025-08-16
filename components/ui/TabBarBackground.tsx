import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />;
  }
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff' }]} />;
}

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}
