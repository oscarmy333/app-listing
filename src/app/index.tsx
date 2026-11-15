import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchPokemons,
  fetchTodosLosPokemons,
  PokemonItem,
} from '../services/pokeapi';
import { useDebounce } from '../hooks/useDebounce';

const obtenerImagenUrl = (url: string) => {
  const partes = url.split('/').filter(Boolean);
  const id = partes[partes.length - 1];
  return `https://githubusercontent.com{id}.png`;
};

export default function PantallaPokedex() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebounce(busqueda, 300);

  // 1. Consulta paginada normal (cuando no se está buscando)
  const {
    data: dataPaginada,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length * 20 : undefined,
  });

  // 2. Catálogo completo en caché para búsquedas instantáneas
  const { data: catalogoCompleto = [] } = useQuery({
    queryKey: ['pokemons-catalogo'],
    queryFn: fetchTodosLosPokemons,
    staleTime: 1000 * 60 * 60, // Mantiene los datos frescos en caché por 1 hora
  });

  // 3. Decidir qué lista mostrar según si hay texto en el buscador
  const listaMostrada: PokemonItem[] = useMemo(() => {
    const termino = busquedaDebounced.trim().toLowerCase();

    if (!termino) {
      return dataPaginada?.pages.flatMap((page) => page.results) ?? [];
    }

    return catalogoCompleto.filter((p) => p.name.includes(termino));
  }, [busquedaDebounced, dataPaginada, catalogoCompleto]);

  const estaBuscando = busquedaDebounced.trim().length > 0;

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {/* Barra de búsqueda */}
      <View style={styles.buscadorContenedor}>
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          style={styles.input}
          placeholder="Buscar Pokémon (ej. pikachu, char...)"
          placeholderTextColor="#94A3B8"
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Botón "X" para limpiar la búsqueda rápidamente */}
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={listaMostrada}
        keyExtractor={(item) => item.name}
        keyboardDismissMode="on-drag" // Oculta el teclado del móvil al hacer scroll
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tarjeta, pressed && styles.presionado]}
            onPress={() => router.push(`/pokemon/${item.name}`)}
          >
            <Image
              source={{ uri: obtenerImagenUrl(item.url) }}
              style={styles.sprite}
            />
            <Text style={styles.nombre}>{item.name}</Text>
          </Pressable>
        )}
        // Mensaje cuando la búsqueda no arroja resultados
        ListEmptyComponent={
          <View style={styles.vacioContenedor}>
            <Text style={styles.textoVacio}>
              No se encontró ningún Pokémon con "{busquedaDebounced}"
            </Text>
          </View>
        }
        // Solo paginamos si NO estamos filtrando una búsqueda
        onEndReached={() => {
          if (!estaBuscando && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          !estaBuscando && isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#EF4444" style={{ marginVertical: 16 }} />
          ) : null
        }
        refreshing={!estaBuscando && isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F8FAFC' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buscadorContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0F172A',
  },
  lista: { padding: 16, paddingTop: 8 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  presionado: { opacity: 0.7 },
  sprite: { width: 64, height: 64 },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 12,
    color: '#1E293B',
  },
  vacioContenedor: { alignItems: 'center', marginTop: 40 },
  textoVacio: { fontSize: 16, color: '#64748B', textAlign: 'center' },
});
