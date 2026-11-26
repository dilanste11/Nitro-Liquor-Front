import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../../../models/category/category.dto';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Categories`;

  getCategories(): Observable<CategoryDTO[]> { return this.http.get<CategoryDTO[]>(this.apiUrl); }
  getCategoryById(id: number): Observable<CategoryDTO> { return this.http.get<CategoryDTO>(`${this.apiUrl}/${id}`); }
  createCategory(category: Partial<CategoryDTO>): Observable<CategoryDTO> { return this.http.post<CategoryDTO>(this.apiUrl, category); }
  updateCategory(id: number, category: Partial<CategoryDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, category); }
  deleteCategory(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}