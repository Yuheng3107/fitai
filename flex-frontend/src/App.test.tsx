import React from 'react';
import { render } from '@testing-library/react';
import App from './App';


const backend = "http://localhost:8000";


test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});


export { backend }