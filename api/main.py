import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

from fastapi.responses import FileResponse
from agent import parse_vcon

origins = [
    "http://localhost:5173",
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIRECTORY = "uploads"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


@app.post("/vcon-upload")
async def upload_file(files: list[UploadFile] = File(...)):
    for file in files:
        if file.content_type != "application/json":
            raise HTTPException(status_code=400, detail="Only JSON files are accepted.")

        content = await file.read()
        try:
            vcon_str = content.decode()
            json_data = json.loads(vcon_str)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(status_code=400, detail="Invalid JSON format.")

        conversation_data = parse_vcon(vcon_str, file.filename)
    return {"message": "Conversation parsed successfully"}


# Serve files in the datasets directory
@app.get("/datasets/{file_name}")
async def get_dataset_file(file_name: str):
    file_path = os.path.join("datasets/", file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")
