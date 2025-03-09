import os
from pathlib import Path

# Base directory for file generation.
# This can be overridden by setting the BASE_DIR environment variable.
# By default, the base directory is set to be two levels above this file's directory.
BASE_DIR = Path(os.getenv("BASE_DIR", (Path(__file__).resolve().parent / ".." / "..").resolve()))
