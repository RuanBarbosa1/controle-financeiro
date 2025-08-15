import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Title } from 'react-native-paper';
import { db } from '../config/firebaseConfig';
import { theme } from '../config/theme';

import FormularioTransacao from '../../components/FormularioTransacao';
import GraficosFinanceiros from '../../components/GraficosFinanceiros';
import ListaTransacoes from '../../components/ListaTransacoes';

type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  tipo: 'entrada' | 'saida';
};

export default function App() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categorias = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Outros'];
  const coresCategorias = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];

  useEffect(() => {
    const q = query(collection(db, "transacoes"), orderBy("descricao", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Transacao[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transacao[];
      setTransacoes(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function adicionarTransacao() {
    if (!descricao || !valor) return;

    setSaving(true);
    await addDoc(collection(db, "transacoes"), {
      descricao,
      valor: parseFloat(valor),
      categoria,
      tipo
    });

    setDescricao('');
    setValor('');
    setCategoria('Alimentação');
    setTipo('entrada');
    setSaving(false);
  }

  function gerarDadosGraficoPorCategoria() {
    const agrupado: Record<string, number> = {};
    transacoes.forEach((t) => {
      agrupado[t.categoria] = (agrupado[t.categoria] || 0) + t.valor;
    });
    return Object.keys(agrupado).map((cat, index) => ({
      name: cat,
      population: agrupado[cat],
      color: coresCategorias[index % coresCategorias.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  }

  function gerarDadosGraficoEntradaSaida() {
    let entradas = 0;
    let saidas = 0;
    transacoes.forEach((t) => {
      if (t.tipo === 'entrada') {
        entradas += t.valor;
      } else {
        saidas += t.valor;
      }
    });
    return [
      { name: 'Entradas', population: entradas, color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Saídas', population: saidas, color: '#F44336', legendFontColor: '#7F7F7F', legendFontSize: 12 }
    ];
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={{ marginVertical: 10 }}>Controle Financeiro</Title>

        <FormularioTransacao
          descricao={descricao}
          setDescricao={setDescricao}
          valor={valor}
          setValor={setValor}
          categoria={categoria}
          setCategoria={setCategoria}
          tipo={tipo}
          setTipo={setTipo}
          categorias={categorias}
          onSubmit={adicionarTransacao}
          saving={saving}
        />

        <ListaTransacoes transacoes={transacoes} loading={loading} />

        {transacoes.length > 0 && !loading && (
          <GraficosFinanceiros
            porCategoria={gerarDadosGraficoPorCategoria()}
            entradaSaida={gerarDadosGraficoEntradaSaida()}
          />
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
});
