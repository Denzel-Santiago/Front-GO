import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideojuegoService } from '../../service/videojuegos.service';
import { Videojuego } from '../../interfaces/videojuego.interface';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './games.component.html',
})
export class GamesComponent implements OnInit {
  juegos: (Videojuego & { imageUrl?: string })[] = [];
  mostrarModal: boolean = false;
  juegoEditandoId: number | null = null;
  imagenPrevia: string | null = null;
  archivoImagen: File | null = null;

  nuevoJuego: Omit<Videojuego, 'id'> = {
    nombre: '',
    descripcion: '',
    genero: '',
    plataforma: '',
    precio: 0,
  };

  constructor(private videojuegoService: VideojuegoService) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos(): void {
    this.videojuegoService.getAll().subscribe({
      next: (data) => {
        this.juegos = data.map(juego => ({
          ...juego,
          imageUrl: this.obtenerImagenJuego(juego.id!)
        }));
      },
      error: (err) => {
        console.error('Error al cargar videojuegos:', err);
      }
    });
  }

  obtenerImagenJuego(juegoId: number): string {
    const imagen = localStorage.getItem(`juego_imagen_${juegoId}`);
    return imagen || 'assets/game-placeholder.jpg';
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.juegoEditandoId = null;
    this.imagenPrevia = null;
    this.archivoImagen = null;
    this.nuevoJuego = {
      nombre: '',
      descripcion: '',
      genero: '',
      plataforma: '',
      precio: 0,
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.archivoImagen = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrevia = e.target?.result as string;
      };
      reader.readAsDataURL(this.archivoImagen);
    }
  }

  agregarJuego(): void {
    this.videojuegoService.add(this.nuevoJuego).subscribe({
      next: (juegoCreado) => {
        if (this.imagenPrevia && juegoCreado.id) {
          localStorage.setItem(`juego_imagen_${juegoCreado.id}`, this.imagenPrevia);
          juegoCreado.imagenUrl = this.imagenPrevia;
        }
        this.juegos.push(juegoCreado);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al agregar videojuego:', err);
      }
    });
  }

  editarJuego(juego: Videojuego & { imageUrl?: string }): void {
    this.juegoEditandoId = juego.id || null;
    this.nuevoJuego = { ...juego };
    this.imagenPrevia = juego.imageUrl || null;
    this.mostrarModal = true;
  }

  actualizarJuego(): void {
    if (!this.juegoEditandoId) return;

    this.videojuegoService.update(this.juegoEditandoId, this.nuevoJuego).subscribe({
      next: () => {
        if (this.imagenPrevia && this.juegoEditandoId) {
          localStorage.setItem(`juego_imagen_${this.juegoEditandoId}`, this.imagenPrevia);
        }
        this.cargarVideojuegos();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar videojuego:', err);
      }
    });
  }

  eliminarJuego(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      this.videojuegoService.delete(id).subscribe({
        next: () => {
          localStorage.removeItem(`juego_imagen_${id}`);
          this.juegos = this.juegos.filter(j => j.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar videojuego:', err);
        }
      });
    }
  }
}