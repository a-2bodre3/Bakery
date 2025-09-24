import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment.development';
import {CategoryModel} from '../model/category-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private supabase :SupabaseClient;
  constructor() {
    this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey)
  }

  async uploadImage(file: File): Promise<string> {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await this.supabase
      .storage
      .from('category-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = this.supabase
      .storage
      .from('category-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async getAllCategories():Promise<CategoryModel[]> {
    const {data , error} = await this.supabase
      .from('categories')
      .select('*')
    if (error) throw error;
    return data as CategoryModel[];
  }

  async getCategoryById(id:string):Promise<CategoryModel | null> {
    const {data , error} = await this.supabase
    .from('categories')
    .select('*')
      .eq('id',id)
      .single()
    if (error) throw error;
    return data as CategoryModel;
  }
  async create(category: Omit<CategoryModel, 'id'>, file?: File): Promise<CategoryModel> {
    let imageUrl = category.image;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const { data, error } = await this.supabase
      .from('categories')
      .insert([{ ...category, image: imageUrl }])
      .select()
      .single();

    if (error) throw error;
    return data as CategoryModel;
  }

  async update(id: string, category: Partial<CategoryModel>, file?: File): Promise<CategoryModel> {
    let imageUrl = category.image;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const { data, error } = await this.supabase
      .from('categories')
      .update({ ...category, image: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as CategoryModel;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
