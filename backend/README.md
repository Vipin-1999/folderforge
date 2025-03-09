# FolderForge Backend

This backend project provides an API to create files and folders on your local system based on a given input structure. The API is built using FastAPI and uses Pydantic for request validation. No database is required, as the file system is used for storage.

## Backend Code Folder Structure

The following tree represents the project structure for this backend:

```text
backend/
├── config.py             # Application configuration (e.g., base directory)
├── file_creator.py       # Contains the logic to create files and directories
├── main.py               # FastAPI application entry point with API endpoints
├── schemas.py            # Pydantic models for file structure input
└── README.md             # Project documentation
```

## Features

- **Dynamic file/folder creation:** Create a directory tree with files and folders based on JSON input.
- **Validation:** Input is validated using Pydantic models.
- **Local storage:** All files and folders are created on the local system (no database needed).

## Getting Started

### Prerequisites

- Python 3.8 or higher
- `pip` package installer

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd backend
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install required packages:**

   ```bash
   pip install fastapi uvicorn pydantic
   ```

### Running the Application

Start the FastAPI server using Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### API Endpoint

- **POST `/create-structure`**

  Accepts a JSON payload representing the file and folder structure to be created. The root of the structure must be a directory.

  #### Example Request Body

  ```json
  {
    "name": "backend",
    "type": "directory",
    "children": [
      {
        "name": "config.py",
        "content": "# Application configuration and environment settings"
      },
      {
        "name": "file_creator.py",
        "content": "# Logic to create files and directories"
      },
      {
        "name": "main.py",
        "content": "# FastAPI application entry point"
      },
      {
        "name": "schemas.py",
        "content": "# Pydantic models for request and response validation"
      }
    ]
  }
  ```

## Notes

- The base directory for generated files is defined in `config.py` and defaults to a folder named `generated_structure` in the project root.
- If the specified directory structure already exists, the API will return an error.
