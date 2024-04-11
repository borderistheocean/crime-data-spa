import { render, screen } from '@testing-library/react';
import Navigation from './Navigation/Navigation';
import History from './History/History';

const mockNavigationData =
  [
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
    ]
  ];

test('renders navigation', () => {
  render(<Navigation crimesList={mockNavigationData} />);
  const navLink_1 = screen.getByText(/Anti Social Behaviour/i);
  expect(navLink_1).toBeInTheDocument();
  const navLink_2 = screen.getByText(/Bicycle Theft/i);
  expect(navLink_2).toBeInTheDocument();
  const navLink_3 = screen.getByText(/Burglary/i);
  expect(navLink_3).toBeInTheDocument();
});

const mockHistoryData =
  [
    {
      "postcode": "LE11AA",
      "time": "11/04/2024 18:12:22"
    },
    {
      "postcode": "IV35LG",
      "time": "11/04/2024 16:55:43"
    },
    {
      "postcode": "B46QB",
      "time": "11/04/2024 16:55:41"
    }
  ];

test('renders history', () => {
  render(<History entries={mockHistoryData} />);
  const historyClearButton = screen.getByText(/Clear/i);
  expect(historyClearButton).toBeInTheDocument();
  const historyDeleteEntryButton = screen.findAllByText(/x/i);
  expect(historyDeleteEntryButton).toBeInTheDocument();
  const historyEntry_1 = screen.getByText(/LE11AA/i);
  expect(historyEntry_1).toBeInTheDocument();
  const historyEntry_2 = screen.getByText(/IV35LG/i);
  expect(historyEntry_2).toBeInTheDocument();
  const historyEntry_3 = screen.getByText(/B46QB/i);
  expect(historyEntry_3).toBeInTheDocument();
});