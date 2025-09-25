import { Component } from '@angular/core';
import { CategoryModel } from '../../core/model/category-model';
import { ProductModel } from '../../core/model/product-model';
import { CategoryService } from '../../core/services/category-service';
import { ProductService } from '../../core/services/product-service';
import { CommonModule } from '@angular/common';
import { ProductAnimation } from "../../shared/directives/product-animation";

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductAnimation],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  
  categoryService!: CategoryService;
  productService!: ProductService;

  categories!: CategoryModel[];
  products!: ProductModel[];
  filteredProducts!: ProductModel[];

  selectedCategory: string = 'all';
  
  async ngOnInit() {
    this.categories = await this.categoryService.getAllCategories();
    this.products = await this.productService.getAll();
    this.filteredProducts = [...this.products];
  }

  filterProducts(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.categoryId === category);
    }
  }
}
