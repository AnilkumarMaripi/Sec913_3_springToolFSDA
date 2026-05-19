from pydantic import BaseModel

class SignupSchema(BaseModel):
    fullname: str
    phone: str
    email: str
    password: str
    role: int

class SigninSchema(BaseModel):
    username: str
    password: str
