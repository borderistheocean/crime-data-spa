import { render, screen } from "@testing-library/react";
import CrimeTable from "./CrimeTable";
import { mockMatchMedia } from "../setupTests";
import mockData from "./mockdata.json";

beforeAll(() => {
  mockMatchMedia();
});

test("Should render Crime Table", () => {
  render(<CrimeTable data={mockData} />);

  // The first entry has no outcome_status property and should therefore display ongoing
  const ongoingInvestigationEntry = screen.getByText(/Ongoing/i);
  expect(ongoingInvestigationEntry).toBeInTheDocument();

  // Street names 
  mockData.forEach(entry => {
    const mockCrimeEntryStreet = screen.getByText(new RegExp(entry.location.street.name, "i"));
    expect(mockCrimeEntryStreet).toBeInTheDocument();
  });

  // Postcodes 
  const mockCrimeEntryPostcode = screen.getAllByText(/B46QB/i);
  mockCrimeEntryPostcode.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });

  // Month
  const mockCrimeEntryMonth = screen.getAllByText(/2024-03/i);
  mockCrimeEntryMonth.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });

  // Street
  mockData.forEach(entry => {
    const mockCrimeEntryStreet = screen.getByText(new RegExp(entry.location.street.name, "i"));
    expect(mockCrimeEntryStreet).toBeInTheDocument();
  });

  // Status
  const mockCrimeEntryStatus = screen.getAllByText(/Under investigation/i);
  mockCrimeEntryStatus.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });
});