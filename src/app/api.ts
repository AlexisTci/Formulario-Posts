export async function apiRequest<T>(
    url: string,
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<T | null> {
    try {
      const response = await fetch(url, {
        method,
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error(`Error ${response.status}`);
  
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }
  