from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from schemas import FileNode
from file_creator import create_structure
from config import BASE_DIR
import shutil

app = FastAPI(title="File Structure Creator")

# Add CORS middleware to allow requests from your frontend origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to restrict origins.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/create-structure")
def create_file_structure(root: FileNode):
    """
    Create a file/folder structure based on the provided JSON input.
    The root node must be a directory.
    """
    if root.type != "directory":
        raise HTTPException(status_code=400, detail="Root node must be a directory")
    
    base_path = BASE_DIR / root.name

    # If the directory exists, remove it to allow overwriting.
    if base_path.exists():
        shutil.rmtree(base_path)
    
    create_structure(root, BASE_DIR)
    return {"message": "File structure created successfully."}
