
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up MSW server with the defined handlers
export const server = setupServer(...handlers);
