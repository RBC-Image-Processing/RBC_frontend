# RBC MIDaP Frontend

## Description

RBC MIDaP (Medical Image Data Processing) is a cutting-edge web application designed to streamline the process of medical image management, interpretation, and collaboration among healthcare professionals. This frontend application provides a user-friendly interface for uploading, viewing, and analyzing medical images, incorporating both human expertise and artificial intelligence to improve diagnostic accuracy and efficiency.

## Authors

- Godbright
- Jeanine
- Michael

## Tech Stack

### Core Technologies

- **React**: A popular and efficient JavaScript library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and developer productivity.
- **Vite**: A fast, modern build tool that provides an excellent developer experience and quick build times.

### State Management and Data Fetching

- **Redux Toolkit**: For global state management, with built-in best practices and optimizations.
- **React Query**: For efficient server state management and data fetching.

### Routing

- **React Router**: Handles navigation within the application.

### UI and Styling

- **MUI (Material-UI)**: Provides pre-built, customizable React components following Material Design principles.
- **Styled-components**: For component-scoped CSS with the full power of CSS-in-JS.
- **Tailwind CSS**: For rapid UI development with utility classes.

### Form Handling

- **React Hook Form**: Efficient, flexible form validation and handling.

### Data Visualization

- **D3.js**: For custom, complex visualizations of medical data.
- **Chart.js**: For simpler, pre-built charts and graphs.

### Image Processing

- **Cornerstone.js**: Specifically designed for medical imaging visualization.

### Testing

- **Jest**: For unit and integration testing.
- **React Testing Library**: For component testing.
- **Cypress**: For end-to-end testing.

### Code Quality and Formatting

- **ESLint**: For identifying and fixing code issues.
- **Prettier**: For consistent code formatting.

### Internationalization

- **react-i18next**: For multi-language support.

### API Communication

- **Axios**: For making HTTP requests to the backend.


## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/rbc-midap/frontend.git
   cd frontend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm run lint`: Lints the codebase
- `npm run format`: Formats the codebase using Prettier

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
