import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Creamos la instancia del cliente fuera del componente
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#EF4444' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Pokédex' }} />
        <Stack.Screen name="pokemon/[name]" options={{ title: 'Detalle' }} />
      </Stack>
    </QueryClientProvider>
  );
}
