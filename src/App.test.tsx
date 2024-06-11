import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App';
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { mockMatchMedia } from './setupTests';

// https://testing-library.com/docs/example-react-router/

beforeAll(() => {
  mockMatchMedia();
});

test('Render initial screen without a parameter', async () => {
  render(<App />, { wrapper: BrowserRouter })

  // verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as b46qb and le11aa usually yield good amounts of crime data\./i)).toBeInTheDocument();
});

test('Render initial screen without a parameter then search for a postcode', async () => {
  render(<App />, { wrapper: BrowserRouter })
  // verify page content for default route
  expect(screen.getByText(/enter postcode\(s\) to search for crimes, entries such as b46qb and le11aa usually yield good amounts of crime data\./i)).toBeInTheDocument();

  // https://testing-library.com/docs/example-input-event/

  // screen.getByRole('textbox')

  // userEvent.
});

test('Render screen with postcode parameter', async () => {
  const { getByRole } = render(
    <MemoryRouter initialEntries={["/?postcode=B46QB"]}>
      <App />
    </MemoryRouter>,
  );

  // Expect titles to show on render
  await waitFor(() =>
    expect(getByRole('heading', {
      name: /anti social behaviour/i
    })).toBeInTheDocument()
  );

});
