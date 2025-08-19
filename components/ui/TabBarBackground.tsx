import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <BlurView intensity={50} style={styles.background} />;
  }

  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Simula translucidez
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#ccc',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});
