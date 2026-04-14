from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import authenticate_user, create_access_token, get_current_user
from app.views.auth import AuthTokenResponse, LoginPayload, UserView

router = APIRouter(prefix="/auth", tags=["Autenticacao"])


@router.post("/login", response_model=AuthTokenResponse)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.username.strip(), payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario ou senha invalidos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id_user, username=user.username, role=user.role)
    return AuthTokenResponse(
        access_token=access_token,
        user=UserView(id_user=user.id_user, username=user.username, role=user.role),
    )


@router.get("/me", response_model=UserView)
def read_current_user(current_user=Depends(get_current_user)):
    return UserView(id_user=current_user.id_user, username=current_user.username, role=current_user.role)