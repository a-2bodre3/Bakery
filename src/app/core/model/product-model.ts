export interface ProductModel {
  id?: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category_id: string;    // مطابق لقاعدة البيانات
  categoryName?: string;  // لإظهار اسم الفئة في الواجهة
}
