import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    /*TODO: PublicLayoutComponent*/
    children :[
      {path:'',/*TODO: HomeComponent*/},
      {path:'products',/*TODO: ProductsComponent*/},
      {path:'our-story',/*TODO:OurStoryComponent*/},
      {path:'content',/*TODO:contentComponent*/},
      {path:'about',/*TODO:aboutComponent*/}
    ]
  },
  {
    path:'admin',
    children:[
      {path: 'login',/*TODO:AdminLoginComponent*/},
      {
        path: '',
        /*TODO:DashboardComponent*/
        /*TODO:CanActive*/
        children:[
          {path:'dashboard',/*TODO:DashboardComponent*/},
          {
            path:'product',
            /*TODO:productComponent*/
            children:[
              {path:'list',/*TODO:ProductListComponent*/},
              {path:'new',/*TODO:productFormComponent */},
              {path:'edit::id',/*TODO:ProductFormComponent*/},
            ]
          },
          {
            path:'category',
            /*TODO:categoryComponent*/
            children:[
              {path:'list',/*TODO:categoryListComponent*/},
              {path:'new',/*TODO:categoryFormComponent */},
              {path:'edit::id',/*TODO:categoryFormComponent*/},
            ]
          }
        ]
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
