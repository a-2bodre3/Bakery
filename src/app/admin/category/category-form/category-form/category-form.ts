import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm {
  isEditMode: string | undefined;
  category: any;
  imageUrlPreview: any;

  onSubmit() {

  }

  onFileSelected($event: Event, category: string) {
    
  }
}
