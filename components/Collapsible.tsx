import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
      </TouchableOpacity>
      {!collapsed && <View style={{ paddingTop: 10 }}>{children}</View>}
    </View>
  );
}
