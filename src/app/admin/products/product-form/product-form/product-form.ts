import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {
  isEditMode: string | undefined;
  product: any;
  imageUrlPreview: any;

  onSubmit() {

  }

  onFileSelected($event: Event, product: string) {
    
  }
}
