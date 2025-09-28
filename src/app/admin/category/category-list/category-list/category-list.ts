import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service';
import {CategoryModel} from '../../../../core/model/category-model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList {
  private categoryService = inject(CategoryService);

  // Property to hold the list of categories
  categories: CategoryModel[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.categories = await this.categoryService.getAllCategories();
    } catch (e: any) {
      console.error('Failed to load categories:', e);
      this.error = 'Failed to load categories. Please try again.';
      // In a real app, you'd use a more user-friendly notification service here.
    } finally {
      this.isLoading = false;
    }
  }

  async onDelete(id: string): Promise<void> {
    // Add a confirmation dialog for better UX
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await this.categoryService.delete(id);
      // After successful deletion, refresh the list of categories
      // or simply remove the item from the local array
      this.categories = this.categories.filter(c => c.id !== id);
      // In a real app, show a success toast/notification.
    } catch (e: any) {
      console.error('Failed to delete category:', e);
      alert('Error deleting category: ' + e.message);
    }
  }
}
