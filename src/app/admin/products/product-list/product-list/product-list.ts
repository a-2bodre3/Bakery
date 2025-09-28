import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductService} from '../../../../core/services/product-service';
import {CategoryService} from '../../../../core/services/category-service';
import {CategoryModel} from '../../../../core/model/category-model';
import {ProductModel} from '../../../../core/model/product-model';
import {NgForOf, NgIf} from '@angular/common';

class ProductViewModel {
}

@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products: ProductModel[] = [];
  categories: CategoryModel[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      // 1. جلب الفئات أولاً
      this.categories = await this.categoryService.getAllCategories();

      // 2. جلب المنتجات
      const rawProducts: ProductModel[] = await this.productService.getAll();

      // 3. ربط المنتجات بأسماء الفئات
      this.products = rawProducts.map(product => ({
        ...product,
        categoryName: this.getCategoryName(product.category_id)
      }));

    } catch (e: any) {
      this.error = 'Failed to load data: ' + e.message;
      console.error('Error loading product/category data:', e);
    } finally {
      this.isLoading = false;
    }
  }

  getCategoryName(categoryId: string ): string {
    if (!categoryId) {
      console.log(categoryId)
      console.log(this.categories)
      console.log(this.products)

      return 'Bakery';
    }

    const category = this.categories.find(c => c.id === categoryId);

    if (!category) {

      return 'Unknown';
    }

    return category.name;
  }

  async onDelete(id: string | undefined): Promise<void> {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await this.productService.delete(id);
      // إزالة المنتج من القائمة المحلية بعد الحذف
      this.products = this.products.filter(p => p.id !== id);
      alert('Product deleted successfully!');
    } catch (e: any) {
      console.error('Error deleting product:', e);
      alert('Failed to delete product: ' + e.message);
    }
  }
}
