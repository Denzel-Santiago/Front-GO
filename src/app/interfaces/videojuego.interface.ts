export interface Videojuego {
    id?: number;
    nombre: string;
    descripcion: string;
    genero: string;
    plataforma: string;
    precio: number;
    deleted?: boolean;
    imagenUrl?: string; // Nueva propiedad para la imagen
  }