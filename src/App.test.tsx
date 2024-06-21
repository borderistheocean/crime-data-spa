import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import App from "./App";
import { BrowserRouter, MemoryRouter } from "react-router-dom"
import { mockMatchMedia } from "./setupTests";

// https://testing-library.com/docs/example-react-router/
// https://testing-library.com/docs/example-input-event/

beforeAll(() => {
  mockMatchMedia();
});

test("Render initial screen without a parameter", async () => {
  render(<App />, { wrapper: BrowserRouter })

  // Verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as and usually yield good amounts of crime data\./i)).toBeInTheDocument();
});

test("Render initial screen without a parameter then search for a postcode", async () => {
  render(<App />, { wrapper: BrowserRouter })

  // verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as and usually yield good amounts of crime data\./i)).toBeInTheDocument();

  // Enter new postcode value
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "LE11AA" } });
  // Click submit
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  // Check headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("heading", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check navigation headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("link", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check that new entry exists in the history component 
  const historyView = screen.getByTestId("0LE11AA");
  expect(within(historyView).getByText(/le11aa/i)).toBeInTheDocument();

  // Check history entry can be removed
  fireEvent.click(within(historyView).getByRole("button", {
    name: /delete/i
  }));

  // Check that history is cleared and clear all button is disabled
  expect(screen.getByRole("button", {
    name: /clear all/i
  })).toBeDisabled();

  // verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as and usually yield good amounts of crime data\./i)).toBeInTheDocument();
});

test("Render screen with postcode parameter", async () => {
  render(
    <MemoryRouter initialEntries={["/?postcode=B46QB"]}>
      <App />
    </MemoryRouter>
  );

  // Check headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("heading", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check navigation headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("link", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );
});

test("Render screen with multiple postcode parameters", async () => {
  render(
    <MemoryRouter initialEntries={["/?postcode=B46QB,LE11AA"]}>
      <App />
    </MemoryRouter>
  );

  // Check that new entry exists in the history component 
  const historyView = screen.getByTestId("0B46QB,LE11AA");
  expect(within(historyView).getByText(/b46qb,le11aa/i)).toBeInTheDocument();

  // Check headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("heading", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check navigation headings are rendered
  await waitFor(() =>
    expect(screen.getByRole("link", {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );
});