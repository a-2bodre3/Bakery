import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ProductService} from '../../../../core/services/product-service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductModel} from '../../../../core/model/product-model';
import {CategoryService} from '../../../../core/services/category-service';
import {CategoryModel} from '../../../../core/model/category-model';

@Component({
  selector: 'app-product-form',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {

  // Inject Services using the modern Angular 20 approach
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  imageUrlPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isEditMode = false;
  productId: string | undefined | null = null;
  categories: CategoryModel[] = [];

  // خاصية لحفظ اسم الصورة الأصلية في وضع التعديل إذا لم يتم رفع صورة جديدة
  existingImageUrl: string | null = null;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    this.initializeForm();
    this.loadCategories();

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  initializeForm(): void {
    // تم حذف Validators.required من 'imageFile' لأنه ليس إجبارياً في وضع التعديل
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      // هذا الحقل لملف الصورة فقط، وليس لـ URL
      imageFile: [null]
    });
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoryService.getAllCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      // يمكن إضافة تنبيه للمستخدم هنا
    }
  }

  async loadProduct(id: string): Promise<void> {
    try {
      const product = await this.productService.getById(id);
      if (!product) {
        this.router.navigate(['/admin/product/list']);
        return;
      }

      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        categoryId: product.category_id,
        price: product.price,
        // لا يتم إرجاع ملف هنا، فقط قيم النص والأرقام
      });

      // حفظ الـ URL للصورة الحالية وعرضها
      this.imageUrlPreview = product.image;
      this.existingImageUrl = product.image; // حفظ الـ URL الأصلي
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.productForm.patchValue({ imageFile: this.selectedFile });

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrlPreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async onSubmit(): Promise<void> {
    // في وضع الإضافة يجب أن يكون هناك ملف صورة مرفوع
    if (!this.isEditMode && !this.selectedFile) {
      alert('Image file is required for a new product.');
      return;
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: Omit<ProductModel, 'id'> = {
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      category_id: this.productForm.get('category_id')?.value,
      price: this.productForm.get('price')?.value,
      // نستخدم الصورة الأصلية إذا كنا في وضع التعديل ولم يتم رفع ملف جديد
      image: this.isEditMode && !this.selectedFile ? this.existingImageUrl || '' : ''
    };

    try {
      let result: ProductModel;

      if (this.isEditMode && this.productId) {
        // في التعديل، نمرر الملف المرفوع فقط إذا تم اختيار ملف جديد
        result = await this.productService.update(
          this.productId,
          productData,
          this.selectedFile || undefined
        );
      } else {
        // في الإضافة، نمرر الملف المرفوع
        result = await this.productService.create(
          productData,
          this.selectedFile! // File is guaranteed to exist by the check above
        );
      }

      console.log('Product saved successfully:', result);
      // التوجيه إلى قائمة المنتجات
      this.router.navigate(['/admin/product/list']);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Check the console for details.');
    }
  }
}
