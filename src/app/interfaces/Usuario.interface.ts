export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    plataforma: string;
    correo_electronico: string;
    deleted?: boolean;
  }