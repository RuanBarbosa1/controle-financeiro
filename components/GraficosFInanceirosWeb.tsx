import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import * as XLSX from 'xlsx';

type ResumoMensalData = {
  mes: string;
  entradas: number;
  saidas: number;
};

type Props = {
  resumoMensal?: ResumoMensalData[];
};

export default function GraficosFinanceirosWeb({ resumoMensal }: Props) {
  const meses = resumoMensal?.map(r => r.mes) || [];
  const entradasMensais = resumoMensal?.map(r => r.entradas) || [];
  const saidasMensais = resumoMensal?.map(r => r.saidas) || [];

  const mesesFormatados = meses.map(m => {
    const [year, month] = m.split('-');
    return `${parseInt(month)}/${year.slice(2)}`;
  });

  const data = {
    labels: mesesFormatados,
    datasets: [
      {
        label: 'Entradas',
        data: entradasMensais,
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Saídas',
        data: saidasMensais,
        backgroundColor: '#F44336',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Resumo Mensal' },
    },
  };

  function exportarCSV() {
    if (!resumoMensal || resumoMensal.length === 0) return;

    const csvData = resumoMensal.map(({ mes, entradas, saidas }) => ({
      Mês: mes,
      Entradas: entradas,
      Saídas: saidas,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'resumo_mensal.csv');
  }

  function exportarXLSX() {
    if (!resumoMensal || resumoMensal.length === 0) return;

    const dadosPlanilha = resumoMensal.map(({ mes, entradas, saidas }) => ({
      Mês: mes,
      Entradas: entradas,
      Saídas: saidas,
    }));

    const ws = XLSX.utils.json_to_sheet(dadosPlanilha);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo Mensal');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'resumo_mensal.xlsx');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Title>Resumo Mensal</Title>
      {resumoMensal && resumoMensal.length > 0 ? (
        <>
          <Bar data={data} options={options} />

          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={exportarCSV} style={styles.button}>
              Exportar CSV
            </Button>
            <Button mode="contained" onPress={exportarXLSX} style={styles.button}>
              Exportar Excel
            </Button>
          </View>
        </>
      ) : (
        <Text>Nenhum dado disponível.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
