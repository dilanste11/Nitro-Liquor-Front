import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryDTO } from '../../../../models/category/category.dto';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: CategoryDTO[] = [];
  isLoading = true;

  ngOnInit() { 
    this.loadCategories(); 
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.isLoading = false;
      }
    });
  }

  deleteCategory(id: number) {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}