
import { http, HttpResponse } from 'msw';

// Define handlers for mock API responses
export const handlers = [
  // Mock API response for fetching strategic goals
  http.get('/api/goals', () => {
    return HttpResponse.json([
      { id: '1', title: 'Increase market share', progress: 75, status: 'in_progress' },
      { id: '2', title: 'Reduce operational costs', progress: 40, status: 'in_progress' },
      { id: '3', title: 'Launch new product line', progress: 10, status: 'planning' }
    ]);
  }),
  
  // Mock API response for authentication
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'manager'
        },
        token: 'fake-jwt-token'
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401 }
    );
  }),
  
  // Add more mock API handlers as needed
];
