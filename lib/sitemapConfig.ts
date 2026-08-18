// OJO: Supabase/PostgREST tiene un límite duro de 1000 filas por pedido sin
// importar el .range() pedido — usar 1000 acá evita tener que paginar adentro
// de cada chunk (mismo límite documentado en memoria para otras consultas).
export const CHUNK_SIZE = 1000
