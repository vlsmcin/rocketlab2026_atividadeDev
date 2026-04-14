from pydantic import BaseModel


class LoginPayload(BaseModel):
    username: str
    password: str


class UserView(BaseModel):
    id_user: str
    username: str
    role: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserView