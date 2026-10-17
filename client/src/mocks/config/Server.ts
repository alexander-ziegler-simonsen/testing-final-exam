import { setupServer } from 'msw/node';
import { AllHandlers } from '../AllHandlers';

export const server = setupServer(...AllHandlers);