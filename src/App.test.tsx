import { render, screen } from '@testing-library/react';
import App from './App';

test('renders input label for postcode search', () => {
  render(<App />);
  const inputLabel = screen.getByText(/Postcode/i);
  expect(inputLabel).toBeInTheDocument();
});
