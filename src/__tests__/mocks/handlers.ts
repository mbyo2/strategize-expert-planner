
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock authentication endpoints
  http.post('*/auth/v1/token', async ({ request }) => {
    try {
      // Parse the request body
      const requestBody = await request.json();
      
      // Type assertion for the request body
      const { email, password } = requestBody as { 
        email: string; 
        password: string; 
        grant_type?: string; 
      };

      // Simple validation
      if (email === 'test@example.com' && password === 'password123') {
        return HttpResponse.json({
          access_token: 'mocked-access-token',
          refresh_token: 'mocked-refresh-token',
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' }
          }
        });
      }
      
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401 }
      );
    } catch (e) {
      return new HttpResponse(
        JSON.stringify({ error: 'Bad request' }),
        { status: 400 }
      );
    }
  }),

  // Mock endpoint for profiles
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }),

  // Mock endpoint for user_roles
  http.get('*/rest/v1/user_roles', () => {
    return HttpResponse.json([
      {
        id: '456',
        user_id: '123',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }),

  // Other handlers can be added here
];
