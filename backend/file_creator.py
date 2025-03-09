from pathlib import Path
from schemas import FileNode

def create_structure(node: FileNode, parent: Path):
    """
    Recursively create directories and files based on the provided node.
    """
    current_path = parent / node.name
    if node.type == "directory":
        current_path.mkdir(parents=True, exist_ok=True)
        # Create each child in the directory.
        for child in node.children or []:
            create_structure(child, current_path)
    else:
        # Ensure the parent directory exists and create the file.
        current_path.parent.mkdir(parents=True, exist_ok=True)
        with open(current_path, "w") as f:
            f.write(node.content or "")