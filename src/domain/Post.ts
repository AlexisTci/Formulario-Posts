export interface Post {
    title: string;
    description: string;
    images: File[];
  }
  
  export interface BlogResponse {
    id: string;
    title: string;
    description: string | null;
    date: string;
    status: string;
    created_at: string;
    updated_at: string;
    images: string[]; // o más específico si son objetos
  }

  export interface BlogDeleteResponse{
    status: string; 
    message: string;
    blog_id: string;
  } 