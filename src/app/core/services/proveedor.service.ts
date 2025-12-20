import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proveedor, CreateProveedorDto, UpdateProveedorDto } from '../../models/proveedor.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/suppliers'; 

  private proveedores = signal<Proveedor[]>([]);  
  readonly proveedores$ = this.proveedores.asReadonly();

  constructor() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.http.get<Proveedor[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.proveedores.set(data);
        console.log("Proveedores recibidos del backend:", data);
      },
      error: (err) => console.error('Error fetching suppliers', err)
    });
  }

  create(dto: CreateProveedorDto): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, dto).pipe(
      tap(newProv => this.proveedores.update(list => [...list, newProv]))
    );
  }

  update(id: number, dto: UpdateProveedorDto): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updated => this.proveedores.update(list => 
        list.map(p => p.id === id ? updated : p)
      ))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.proveedores.update(list => list.filter(p => p.id !== id)))
    );
  }
}