import {Component , signal} from '@angular/core';
import {Dashboard} from './admin/dashboard/dashboard/dashboard';
import {CategoryForm} from './admin/category/category-form/category-form/category-form';
import {ProductForm} from './admin/products/product-form/product-form/product-form';


@Component({
  selector: 'app-root',
  imports: [
    Dashboard,
    CategoryForm,
    ProductForm

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App   {

}
