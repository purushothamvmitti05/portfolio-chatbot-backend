# 🤖 Portfolio Chatbot Backend
An AI-powered chatbot backend built with **FastAPI** and **Groq LLM API** to power my personal portfolio website. The chatbot answers questions about my skills, projects, experience, resume, and contact information in real time.

## 🚀 Live Demo
Portfolio:
https://portfolio-chatbot-backend-nzoa.onrender.com/

---

## ✨ Features

- 🤖 AI-powered chatbot using Groq API
- ⚡ FastAPI backend
- 🔒 Secure API key using environment variables
- 🌐 REST API endpoint
- 📱 Portfolio integration
- 🚀 Deployed on Render

---

## 🛠 Tech Stack

- Python 3
- FastAPI
- Uvicorn
- Groq API
- HTML
- CSS
- JavaScript
- Render

---

## 📂 Project Structure

```text
portfolio-chatbot-backend/
│
├── static/
├── main.py
├── requirements.txt
├── .env
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/purushothamvmitti05/portfolio-chatbot-backend.git
```

Go to the project folder

```bash
cd portfolio-chatbot-backend
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key
```

Run the server

```bash
uvicorn main:app --reload
```

---

## 🌐 API Endpoint

### Chat

```http
POST /chat
```

Example Request

```json
{
  "message": "Tell me about yourself"
}
```

Example Response

```json
{
  "reply": "I'm Purushotham V Mitti, a Software Developer..."
}
```

---

## 🚀 Deployment

This project is deployed on **Render**.

Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Environment Variable

```text
GROQ_API_KEY=your_api_key
```

---

## 📌 Future Improvements

- Conversation memory
- Resume-aware responses
- Project recommendations
- Visitor analytics
- Multi-language support
- Streaming responses

---

## 👨‍💻 Author

**Purushotham V Mitti**

GitHub:
https://github.com/purushothamvmitti05

Portfolio:
(Add your portfolio link)

LinkedIn:
(Add your LinkedIn link)

---

## 📄 License

This project is licensed under the MIT License.
