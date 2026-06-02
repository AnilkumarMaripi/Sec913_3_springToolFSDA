from fastapi import APIRouter, Header
import httpx
from typing import List, Dict, Any

router = APIRouter()

SPRING_URL = "http://localhost:8001/"

@router.get("/role/list")
async def list_roles():
    async with httpx.AsyncClient() as client:
        response = await client.get(SPRING_URL + "role/list")
    return response.json()

@router.post("/role/add")
async def add_role(role: Dict[Any, Any]):
    async with httpx.AsyncClient() as client:
        response = await client.post(SPRING_URL + "role/add", json=role)
    return response.json()

@router.get("/menu/list")
async def list_menus():
    async with httpx.AsyncClient() as client:
        response = await client.get(SPRING_URL + "menu/list")
    return response.json()

@router.post("/menu/add")
async def add_menu(menu: Dict[Any, Any]):
    async with httpx.AsyncClient() as client:
        response = await client.post(SPRING_URL + "menu/add", json=menu)
    return response.json()

@router.post("/role/map")
async def map_role(data: Dict[Any, Any]):
    async with httpx.AsyncClient() as client:
        response = await client.post(SPRING_URL + "role/map", json=data)
    return response.json()

@router.get("/role/stats")
async def get_stats():
    async with httpx.AsyncClient() as client:
        response = await client.get(SPRING_URL + "role/stats")
    return response.json()
