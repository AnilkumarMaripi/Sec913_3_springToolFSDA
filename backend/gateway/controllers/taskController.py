from fastapi import APIRouter
import httpx
from typing import Dict, Any

router = APIRouter(prefix="/tasks")

SPRING_URL = "http://localhost:8001/tasks"

@router.get("/list")
async def list_tasks():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPRING_URL}/list")
    return response.json()

@router.post("/add")
async def add_task(task: Dict[Any, Any]):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{SPRING_URL}/add", json=task)
    return response.json()

@router.post("/delete")
async def delete_task(task: Dict[Any, Any]):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{SPRING_URL}/delete", json=task)
    return response.json()
