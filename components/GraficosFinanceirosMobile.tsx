import Papa from 'papaparse';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import RNFS from 'react-native-fs';
import { Button, Title } from 'react-native-paper';
import Share from 'react-native-share';
import * as XLSX from 'xlsx';

type GraficoData = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type ResumoMensalData = {
  mes: string;
  entradas: number;
  saidas: number;
};

type Props = {
  porCategoria: GraficoData[];
  entradaSaida: GraficoData[];
  resumoMensal?: ResumoMensalData[];
};

export default function GraficosFinanceirosMobile({ porCategoria, entradaSaida, resumoMensal }: Props) {
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  };

  const meses = resumoMensal?.map(r => r.mes) || [];
  const entradasMensais = resumoMensal?.map(r => r.entradas) || [];
  const saidasMensais = resumoMensal?.map(r => r.saidas) || [];

  const mesesFormatados = meses.map(m => {
    const [year, month] = m.split('-');
    return `${parseInt(month)}/${year.slice(2)}`;
  });

  async function exportarResumoMensalCSV() {
    if (!resumoMensal || resumoMensal.length === 0) return;

    const csvData = resumoMensal.map(({ mes, entradas, saidas }) => ({
      Mês: mes,
      Entradas: entradas,
      Saídas: saidas,
    }));

    const csv = Papa.unparse(csvData);
    const path = RNFS.DocumentDirectoryPath + '/resumo_mensal.csv';
    await RNFS.writeFile(path, csv, 'utf8');
    await Share.open({
      url: 'file://' + path,
      type: 'text/csv',
      filename: 'resumo_mensal',
    });
  }

  async function exportarResumoMensalXLSX() {
    if (!resumoMensal || resumoMensal.length === 0) return;

    const dadosPlanilha = resumoMensal.map(({ mes, entradas, saidas }) => ({
      Mês: mes,
      Entradas: entradas,
      Saídas: saidas,
    }));

    const ws = XLSX.utils.json_to_sheet(dadosPlanilha);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo Mensal');

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const path = RNFS.DocumentDirectoryPath + '/resumo_mensal.xlsx';
    await RNFS.writeFile(path, wbout, 'base64');
    await Share.open({
      url: 'file://' + path,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: 'resumo_mensal',
    });
  }

  return (
    <ScrollView horizontal contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}>
      <View style={{ alignItems: 'center', marginTop: 20, width: Dimensions.get('window').width - 20 }}>
        <Title>Gastos por Categoria</Title>
        <PieChart
          data={porCategoria}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={{ marginTop: 10 }}
        />

        <Title style={{ marginTop: 20 }}>Entradas vs Saídas</Title>
        <PieChart
          data={entradaSaida}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={{ marginTop: 10 }}
        />

        {resumoMensal && resumoMensal.length > 0 && (
          <>
            <Title style={{ marginTop: 20 }}>Resumo Mensal</Title>

            <View style={styles.legendContainer}>
              <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Entradas</Text>

              <View style={[styles.legendItem, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Saídas</Text>
            </View>

            <BarChart
              data={{
                labels: mesesFormatados,
                datasets: [
                  { data: entradasMensais, color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})` },
                  { data: saidasMensais, color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})` },
                ],
              }}
              width={Math.max(320, meses.length * 60)}
              height={280}
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.5,
              }}
              verticalLabelRotation={45}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />

            <Button
              mode="contained"
              onPress={exportarResumoMensalCSV}
              style={{ marginTop: 20 }}
            >
              Exportar Resumo Mensal para CSV
            </Button>

            <Button
              mode="contained"
              onPress={exportarResumoMensalXLSX}
              style={{ marginTop: 10 }}
            >
              Exportar Resumo Mensal para Excel
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 3,
  },
  legendText: {
    marginRight: 15,
    fontSize: 14,
  },
});
