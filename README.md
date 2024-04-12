# Crime Data Frontend Tech Test

I have created this project to showcase my skills in React. It is based on the requirements spec for a Single Page Application. Details of such are as follows:

We would like you to build a small SPA using React and React Router that allows a user to search crime data by postcodes.

At a minimum, the SPA should have a Search Bar, and Historic Search section, and have two distinct screens: a Data View screen and a Map screen of the crime data.

You can either create both screens or just a single one with a placeholder for the one that does not get implemented, the choice is yours. However, do build as if both screens were being made.

### Requirements

#### Search Bar

- Allow the user to search by postcode
- Allow the user to search by postcodes using a comma-separated list
- Only trigger a search when at least one valid postcode has been entered
- The query string should be updated to reflect the current list of valid postcodes
- If the page is loaded with postcodes within the query string it should trigger a search on those postcodes
- Make sure not to trigger too many requests

### Data View

- Display an individual section for each crime type under which is a table
- Each Table should display at a minimum the following values
    - Postcode
    - Date of crime
    - Approximate street name
    - Outcome status
        - Treat a null value in this field as 'On Going'
- Give the user the ability to quickly navigate to different crime types

 ### Map

- View automatically centers on the searched postcode
- In the case of multiple postcodes, center on the first item in the list
- Display a mark on the map to show where each crime was committed
- Show a boundary box of the postcode area
- On hover of a mark should display a tooltip showing
    - Postcode
    - Category of crime
    - Date of crime
    - Outcome status
        - Treat a null value in this field as 'On Going'

### Nice to haves 

- Cover your code with tests as much as you can

### API to use

#### Postcode

- http://api.getthedata.com/postcode/

#### Crime Data

- https://data.police.uk/api/crimes-street/all-crime

### Constraints

- Use React V18
- Use React Hooks
- Use React Router
- Do not leave any unused dependencies or scripts
- Do not mock API response in your repository other than for tests

### Preferences

- Use TypeScript
- Use any build tool or boilerplate configuration
    - ViteJS
    - Webpack,
    - Create-react-app
- Use any design framework you are familiar with
    - Tailwind CSS
    - MUI
    - Ant Design

### Evaluation Points

- Use of community best practices
- Use of clean code which is self-documenting
- Use of domain-driven design Clean and extendable project structure
- Consideration of UI/UX
- Use of css-in-js
- Use of design frameworks
- Use of code quality checkers such as linters
- Use of appropriate commit messages


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
