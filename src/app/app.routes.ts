import { Routes } from '@angular/router';
import {PublicLayout} from './layouts/public-layout/public-layout/public-layout';
import {Home} from './Features/home/home/home';
import {Products} from './Features/products/products';
import {OurStory} from './Features/out-story/our-story/our-story';
import {Contact} from './Features/contact/contact/contact';
import {Login} from './admin/login/login/login';
import {Dashboard} from './admin/dashboard/dashboard/dashboard';
import {authGuard} from './core/guards/auth-guard';
import {ProductList} from './admin/products/product-list/product-list/product-list';
import {ProductForm} from './admin/products/product-form/product-form/product-form';
import {CategoryList} from './admin/category/category-list/category-list/category-list';
import {CategoryForm} from './admin/category/category-form/category-form/category-form';
import {About} from './Features/about/about/about';
import {AdminLayout} from './layouts/admin-layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    component:AdminLayout,
    children :[
      {path:'',component:Home},
      {path:'products',component:Products},
      {path:'our-story',component:OurStory},
      {path:'content',component:Contact},
      {path:'about',component:About},
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'login', component: Login },
      {
        path: '',
        component: PublicLayout,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: Dashboard },
          {
            path: 'product',
            children: [
              { path: 'list', component: ProductList },
              { path: 'new', component: ProductForm },
              { path: 'edit/:id', component: ProductForm },
            ]
          },
          {
            path: 'category',
            children: [
              { path: 'list', component: CategoryList },
              { path: 'new', component: CategoryForm },
              { path: 'edit/:id', component: CategoryForm },
            ]
          }
        ]
      },
      { path: '**', redirectTo: 'login' }
    ]
  }

];
