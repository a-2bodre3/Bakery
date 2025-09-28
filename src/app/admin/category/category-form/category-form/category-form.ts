import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service';

@Component({
  selector: 'app-category-form',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {
  categoryForm!: FormGroup;
  isEditMode = false; // false => Add, true => Edit
  categoryId?: string;
  imageUrlPreview: string | null = null;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null] // سنستخدمه لتخزين الملف مؤقتًا
    });

    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  async loadCategory(id: string) {
    const category = await this.categoryService.getCategoryById(id);
    if (category) {
      this.isEditMode = true;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description,
        image: category.image
      });
      this.imageUrlPreview = category.image;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrlPreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async onSubmit() {
    if (this.categoryForm.invalid) return;

    const formValue = this.categoryForm.value;
    try {
      if (this.isEditMode && this.categoryId) {
        await this.categoryService.update(this.categoryId, formValue, this.selectedFile);
      } else {
        await this.categoryService.create(formValue, this.selectedFile);
      }
      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }
}
