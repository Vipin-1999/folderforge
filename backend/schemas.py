from pydantic import BaseModel
from typing import List, Optional

class FileNode(BaseModel):
    name: str
    # "file" (default) or "directory"
    type: Optional[str] = "file"
    # For files, optional content to be written.
    content: Optional[str] = ""
    # For directories, a list of children FileNodes.
    children: Optional[List["FileNode"]] = []

    class Config:
        orm_mode = True

# This allows for recursive definitions.
FileNode.update_forward_refs()