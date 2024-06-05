import { render, screen } from "@testing-library/react";
import { mockMatchMedia } from "../setupTests";
import mockData from "./mockdata.json";
import CrimeRecords from "./CrimeRecords";

beforeAll(() => {
  mockMatchMedia();
});

test("Should render Crime Records", () => {
  render(<CrimeRecords crimesList={mockData} />);

  // Crime Type Headings 
  mockData.forEach(entry => {
    const crimeTypeHeading = screen.getByText(new RegExp(entry.type, "i"));
    expect(crimeTypeHeading).toBeInTheDocument();
  });

  // Postcode Table Headings
  const postCodeColumn = screen.getAllByText(/Postcode/i);
  postCodeColumn.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });

  // Month Table Headings
  const monthColumn = screen.getAllByText(/Month/i);
  monthColumn.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });

  // Month Table Headings
  const streetColumn = screen.getAllByText(/Street/i);
  streetColumn.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });

  // Status Table Headings
  const statusColumn = screen.getAllByText(/Status/i);
  statusColumn.forEach(entry => {
    expect(entry).toBeInTheDocument();
  });
});