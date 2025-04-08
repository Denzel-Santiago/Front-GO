import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../interfaces/videojuego.interface';

@Injectable({
  providedIn: 'root'
})
export class VideojuegoService {
  private apiUrl = 'http://localhost:8000/videojuegos/'; // Asegúrate que el puerto coincida con tu API Go

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los videojuegos (no eliminados)
   */
  getAll(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(`${this.apiUrl}`);
  }

  /**
   * Obtiene un videojuego por ID
   */
  getById(id: number): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}${id}`);
  }

  /**
   * Crea un nuevo videojuego
   */
  add(videojuego: Omit<Videojuego, 'id'>): Observable<Videojuego> {
    return this.http.post<Videojuego>(`${this.apiUrl}`, videojuego);
  }

  /**
   * Actualiza un videojuego existente
   */
  update(id: number, videojuego: Partial<Videojuego>): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.apiUrl}${id}`, videojuego);
  }

  /**
   * Elimina un videojuego (soft delete)
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }

  /**
   * Obtiene videojuegos por estado (deleted: true/false)
   */
  getByStatus(status: boolean): Observable<Videojuego[]> {
    const statusStr = status ? 'true' : 'false';
    return this.http.get<Videojuego[]>(`${this.apiUrl}status/${statusStr}`);
  }
}