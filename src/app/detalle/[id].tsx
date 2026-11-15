import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PantallaDetalle() {
  const { id, titulo, categoria } = useLocalSearchParams<{
    id: string;
    titulo: string;
    categoria: string;
  }>();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>ID #{id}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.categoria}>Categoría: {categoria}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  categoria: {
    fontSize: 16,
    color: "#475569",
  },
});
