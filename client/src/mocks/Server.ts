import { setupServer } from 'msw/node';
import { createMswHandlers } from '../api/msw.gen';

const { all } = createMswHandlers();
export const server = setupServer(...all());