import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment.development';
import {ProductModel} from '../model/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabase :SupabaseClient;
  constructor() {
    this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey)
  }
  async uploadImage(file: File): Promise<string> {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await this.supabase
      .storage
      .from('product-images') // bucket name
      .upload(filePath, file);

    if (error) throw error;


    const { data } = this.supabase
      .storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
  async getAll(): Promise<ProductModel[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return data as ProductModel[];
  }
  async getById(id: string): Promise<ProductModel | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as ProductModel;
  }
  async create(product: Omit<ProductModel, 'id'>, file?: File): Promise<ProductModel> {
    let imageUrl = product.image;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const { data, error } = await this.supabase
      .from('products')
      .insert([{ ...product, image: imageUrl }])
      .select()
      .single();

    if (error) throw error;
    return data as ProductModel;
  }
  async update(id: string, product: Partial<ProductModel>, file?: File): Promise<ProductModel> {
    let imageUrl = product.image;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const { data, error } = await this.supabase
      .from('products')
      .update({ ...product, image: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProductModel;
  }
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

}
