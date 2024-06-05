import { render, screen } from '@testing-library/react';
import Map from './Map';

test("Should render map", () => {
  render(<Map />);

  // Image
  const map = screen.getByAltText("Map of the UK");
  expect(map).toBeInTheDocument();
});