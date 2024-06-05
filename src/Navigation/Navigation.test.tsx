import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

const mockNavigationData =
  [
    {
      "type": "Anti Social Behaviour"
    },
    {
      "type": "Bicycle Theft"
    },
    {
      "type": "Burglary"
    }
  ];

test("Should render navigation", () => {
  render(<Navigation crimesList={mockNavigationData} />);

  // Crime types
  mockNavigationData.forEach(entry => {
    const navLink = screen.getByText(new RegExp(entry.type, "i"));
    expect(navLink).toBeInTheDocument();
  })
});