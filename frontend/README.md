# ForlderForge Frontend

This frontend application uses Next.js (v15) with TypeScript and Material UI (MUI) to provide an interface for creating file/folder structures on your system. The app parses tree‑style text input (supporting multiple variants of branch markers) into the JSON format required by your backend API. It also supports dark mode based on system preferences.

## Project Structure

```text
frontend/
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
├── public/                  # Public assets (if needed)
└── src/
    ├── app/
    │   ├── globals.css      # Global styles (includes dark mode)
    │   ├── layout.tsx       # Root layout (imports globals.css)
    │   └── page.tsx         # Main page with textfield and submit button
    └── README.md            # Frontend setup and instructions
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or, if using yarn:
   # yarn install
   ```

### Running the Application

Start the development server with:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## How It Works

- **Flexible Parsing:**  
  Paste your file structure (in a tree format using various branch markers such as "├── ", "└── ", "── ", or even "- ") into the text area. The parser converts this into a nested JSON object.

- **Dark Mode:**  
  The global CSS (`globals.css`) applies dark mode automatically if the user’s system prefers a dark color scheme.

- **API Integration:**  
  The parsed JSON is sent via a POST request to the backend API endpoint (`http://localhost:8000/create-structure`).

## Customization

- **Backend URL:**  
  Modify the fetch URL in `src/app/page.tsx` if your backend is hosted on a different port or domain.

- **Styling:**  
  Customize the MUI components and global CSS as needed.
