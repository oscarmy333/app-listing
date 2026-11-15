export interface PokemonItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  results: PokemonItem[];
}

export interface PokemonDetalle {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    slot: number;
    type: { name: string };
  }[];
}

// Obtener lista paginada de Pokémon
export const fetchPokemons = async ({ pageParam = 0 }): Promise<PokemonListResponse> => {
  const limit = 20;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${pageParam}`
  );
  if (!response.ok) throw new Error('Error al cargar los Pokémon');
  return response.json();
};

// Obtener detalle de un Pokémon específico
export const fetchPokemonDetalle = async (name: string): Promise<PokemonDetalle> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) throw new Error('Error al cargar el detalle');
  return response.json();
};

// Agrega esto a tu archivo services/pokeapi.ts existente
export const fetchTodosLosPokemons = async (): Promise<PokemonItem[]> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000'); // Ajusta el límite según tus necesidades
  if (!response.ok) throw new Error('Error al cargar el catálogo');
  const data: PokemonListResponse = await response.json();
  return data.results;
};
