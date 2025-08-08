import { apiRequest } from '../app/api';
import type { Post, BlogResponse, BlogDeleteResponse } from '../domain/Post';

export async function createPost(values: Post): Promise<boolean> {
  
  const formData = new FormData();

  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('date', new Date().toISOString().slice(0, 19).replace('T', ' '));

  values.images.forEach((file: File) => {
    formData.append('images[]', file); 
  });
  const result = await apiRequest<BlogResponse>('https://tciconsultoria.com/TCIWEB/store.php', 'POST', formData);
  return result !== null;
 
}

export async function editPost(formData: FormData): Promise<boolean> {
  
  const result = await apiRequest<BlogResponse>(
    'https://tciconsultoria.com/TCIWEB/update.php',
    'POST',
    formData
  );
  return result !== null;
}

export async function deletePost(id: number): Promise<boolean> {
  const body = {
    "id":id,
    "status": 0
  }
  //'/api/destroy.php'
  //'https://tciconsultoria.com/TCIWEB/destroy.php'
  const result = await apiRequest<BlogDeleteResponse>('https://tciconsultoria.com/TCIWEB/destroy.php', 'POST',body);
  return result !== null;
}

export async function getPostById(id: string) {
    // '/api/getData.php'
    //'https://tciconsultoria.com/TCIWEB/getData.php'
   return await apiRequest<BlogResponse[]>('https://tciconsultoria.com/TCIWEB/getData.php', 'POST', { id } );
}

