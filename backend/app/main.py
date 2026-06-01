from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="FlowBoard", version="0.1.0")


class HealthResponse(BaseModel):
    status: str


@app.get("/health")
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")
