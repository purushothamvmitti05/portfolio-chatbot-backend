from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from groq import Groq
import os

load_dotenv()

app = FastAPI()
# Serve the portfolio frontend from the static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return FileResponse("static/index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

with open("bio.txt", "r", encoding="utf-8") as f:
    BIO = f.read()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": f"You are a chatbot on Purushotham's portfolio website, answering questions on his behalf as if you were him. Be concise and friendly. Here is his info:\n\n{BIO}"},
            {"role": "user", "content": req.message}
        ]
    )
    return {"reply": response.choices[0].message.content}