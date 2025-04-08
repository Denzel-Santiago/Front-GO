import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../service/User.service';
import { Usuario } from '../../interfaces/Usuario.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  usuarios: Usuario[] = [];
  mostrarModal: boolean = false;
  usuarioEditandoId: number | null = null;

  nuevoUsuario: Omit<Usuario, 'id'> = {
    nombre: '',
    apellido: '',
    plataforma: '',
    correo_electronico: '',
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioEditandoId = null;
    this.nuevoUsuario = {
      nombre: '',
      apellido: '',
      plataforma: '',
      correo_electronico: '',
    };
  }

  agregarUsuario(): void {
    this.usuarioService.create(this.nuevoUsuario).subscribe({
      next: (usuarioCreado) => {
        this.usuarios.push(usuarioCreado);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al agregar usuario:', err);
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditandoId = usuario.id || null;
    this.nuevoUsuario = { ...usuario };
    this.mostrarModal = true;
  }

  actualizarUsuario(): void {
    if (!this.usuarioEditandoId) return;

    this.usuarioService.update(this.usuarioEditandoId, this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
        }
      });
    }
  }
}