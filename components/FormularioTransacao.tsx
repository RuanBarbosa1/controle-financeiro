import React from 'react';
import { View } from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';

interface FormularioTransacaoProps {
  descricao: string;
  setDescricao: React.Dispatch<React.SetStateAction<string>>;
  valor: string;
  setValor: React.Dispatch<React.SetStateAction<string>>;
  categoria: string;
  setCategoria: React.Dispatch<React.SetStateAction<string>>;
  tipo: 'entrada' | 'saida';
  setTipo: React.Dispatch<React.SetStateAction<'entrada' | 'saida'>>;
  categorias: string[];
  onSubmit: () => void;
  saving: boolean;
}

export default function FormularioTransacao({
  descricao,
  setDescricao,
  valor,
  setValor,
  categoria,
  setCategoria,
  tipo,
  setTipo,
  categorias,
  onSubmit,
  saving,
}: FormularioTransacaoProps) {
  return (
    <View>
      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      {/* Categoria */}
      <RadioButton.Group onValueChange={setCategoria} value={categoria}>
        {categorias.map((cat) => (
          <RadioButton.Item key={cat} label={cat} value={cat} />
        ))}
      </RadioButton.Group>
      {/* Tipo */}
      <RadioButton.Group
        onValueChange={(value) => setTipo(value as 'entrada' | 'saida')}
        value={tipo}
      >
        <RadioButton.Item label="Entrada" value="entrada" />
        <RadioButton.Item label="Saída" value="saida" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={saving}
        style={{ marginTop: 10 }}
      >
        Adicionar Transação
      </Button>
    </View>
  );
}
