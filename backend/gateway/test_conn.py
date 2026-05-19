import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:8001/role/list")
            print(f"Status: {response.status_code}")
            print(f"Body: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
