import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

type Props = {
  descricao: string;
  setDescricao: (v: string) => void;
  valor: string;
  setValor: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  tipo: 'entrada' | 'saida';
  setTipo: (v: 'entrada' | 'saida') => void;
  categorias: string[];
  onSubmit: () => void;
  saving: boolean;
};

export default function FormularioTransacao({
  descricao, setDescricao,
  valor, setValor,
  categoria, setCategoria,
  tipo, setTipo,
  categorias, onSubmit,
  saving
}: Props) {
  return (
    <View style={styles.form}>
      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <TextInput
        label="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={styles.input}
      />

      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={styles.picker}
      >
        {categorias.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <Picker
        selectedValue={tipo}
        onValueChange={(itemValue) => setTipo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Entrada" value="entrada" />
        <Picker.Item label="Saída" value="saida" />
      </Picker>

      <Button
        mode="contained"
        onPress={onSubmit}
        style={{ marginVertical: 10 }}
        loading={saving}
      >
        Adicionar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    marginVertical: 5,
  },
  picker: {
    width: '100%',
    marginVertical: 5,
  },
});
