import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App';
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { mockMatchMedia } from './setupTests';

// https://testing-library.com/docs/example-react-router/
// https://testing-library.com/docs/example-input-event/

beforeAll(() => {
  mockMatchMedia();
});

test('Render initial screen without a parameter', async () => {
  render(<App />, { wrapper: BrowserRouter })

  // Verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as b46qb and le11aa usually yield good amounts of crime data\./i)).toBeInTheDocument();
});

test('Render initial screen without a parameter then search for a postcode', async () => {
  render(<App />, { wrapper: BrowserRouter })
  
  // verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as b46qb and le11aa usually yield good amounts of crime data\./i)).toBeInTheDocument();

  // Enter new postcode value
  fireEvent.change(screen.getByRole('textbox'), { target: { value: "LE11AA" } });
  // Click submit
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  // Check that new entry exists in the history component 

  // TODO

  // Check headings are rendered
  await waitFor(() =>
    expect(screen.getByRole('heading', {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check navigation headings are rendered
  await waitFor(() =>
    expect(screen.getByRole('link', {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

  // Check history entry can be removed
  fireEvent.click(screen.getByText(/remove/i));
  
  // Check that history is clear
  screen.debug();
});

test('Render screen with postcode parameter', async () => {
  const { getByRole } = render(
    <MemoryRouter initialEntries={["/?postcode=B46QB"]}>
      <App />
    </MemoryRouter>,
  );

  await waitFor(() =>
    expect(getByRole('heading', {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );
});
