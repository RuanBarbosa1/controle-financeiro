import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, useTheme } from 'react-native-paper';

type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  tipo: 'entrada' | 'saida';
};

type Props = {
  transacoes: Transacao[];
  loading: boolean;
};

export default function ListaTransacoes({ transacoes, loading }: Props) {
  const { colors } = useTheme();

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ width: '100%' }}>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.descricao}
              subtitle={`${item.valor} - ${item.categoria} (${item.tipo})`}
            />
          </Card>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    width: '100%',
  },
});
