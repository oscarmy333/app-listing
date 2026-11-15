import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetalle } from '../../services/pokeapi';

export default function DetallePokemon() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetalle(name!),
    enabled: !!name, // Solo ejecuta la petición si existe el parámetro name
  });

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centrado}>
        <Text>No se pudo cargar la información de {name}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Image source={{ uri: data.sprites.front_default }} style={styles.imagenGrande} />
      <Text style={styles.nombre}>
        #{data.id} {data.name}
      </Text>

      <View style={styles.tiposContenedor}>
        {data.types.map((t) => (
          <View key={t.type.name} style={styles.badge}>
            <Text style={styles.badgeTexto}>{t.type.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.stats}>
        <Text style={styles.statTexto}>Altura: {data.height / 10} m</Text>
        <Text style={styles.statTexto}>Peso: {data.weight / 10} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagenGrande: { width: 180, height: 180 },
  nombre: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', color: '#0F172A' },
  tiposContenedor: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: { backgroundColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeTexto: { color: '#FFFFFF', fontWeight: 'bold', textTransform: 'capitalize' },
  stats: { marginTop: 24, gap: 8, alignItems: 'center' },
  statTexto: { fontSize: 16, color: '#475569' },
});
