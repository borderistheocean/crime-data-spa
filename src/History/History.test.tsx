import { render, screen } from "@testing-library/react";
import History from "./History";
import { mockMatchMedia } from "../setupTests";

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

beforeAll(() => {
  mockMatchMedia();
});

it("Should print the history component", () => {
  render(<History entries={mockHistoryData} />);

  mockHistoryData.forEach(entry => {
    // Postcode cell value
    const historyEntryPostcode = screen.getByText(new RegExp(entry.postcode, "i"));
    expect(historyEntryPostcode).toBeInTheDocument();

    // Time row value
    const historyEntryTime = screen.getByText(new RegExp(entry.time, "i"));
    expect(historyEntryTime).toBeInTheDocument();
  })

  // Remove buttons
  const removeButtons = screen.getAllByRole("button", { name: /delete/i });
  removeButtons.forEach(function (button) {
    expect(button).toBeInTheDocument();
  })

  // Clear All button
  const clearAllButton = screen.getByRole("button", { name: /Clear All/i });
  expect(clearAllButton).toBeInTheDocument();
});