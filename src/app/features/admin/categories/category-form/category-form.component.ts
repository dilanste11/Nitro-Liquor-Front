import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryDTO } from '../../../../models/category/category.dto';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoryId: number | null = null;
  isEditMode = false;
  isLoading = false;

  categoryForm = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = Number(id);
      this.isEditMode = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (cat) => this.categoryForm.patchValue({ name: cat.name }),
        error: (err) => console.error('Error cargando la categoría', err)
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isLoading = true;

    // Solución al error de TypeScript: Construimos el objeto asegurando que es string
    const categoryData: Partial<CategoryDTO> = {
      name: String(this.categoryForm.value.name)
    };

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}