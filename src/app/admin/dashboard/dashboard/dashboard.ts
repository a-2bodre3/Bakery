import { Component } from '@angular/core';
import {Header} from '../../../layouts/public-layout/header/header/header';
import {DashboardStatus} from './dashboard-status/dashboard-status';
import {ProductList} from '../../products/product-list/product-list/product-list';
import {CategoryList} from '../../category/category-list/category-list/category-list';

@Component({
  selector: 'app-dashboard',
  imports: [
    Header,
    DashboardStatus,
    ProductList,
    CategoryList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
