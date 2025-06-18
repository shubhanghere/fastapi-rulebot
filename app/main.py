from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.config import RULES

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "message": "", "link": ""})

@app.get("/about/{topic}", response_class=HTMLResponse)
async def about_topic(request: Request, topic: str):
    data = RULES.get(topic)
    if data:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "message": data["description"],
            "link": data.get("linkedin") or data.get("website")
        })
    return templates.TemplateResponse("index.html", {
        "request": request,
        "message": "No information found for that topic.",
        "link": None
    })
