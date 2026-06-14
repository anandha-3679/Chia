"""Auth routes, assembled from FastAPI Users' prebuilt routers.

Endpoints exposed:
    POST /auth/register   - signup (email + password)
    POST /auth/login      - login, returns a JWT access token
    POST /auth/logout     - logout
    GET  /users/me        - current user profile
    PATCH /users/me       - update current user
"""

from fastapi import APIRouter

from schemas.user import UserCreate, UserRead, UserUpdate
from users import auth_backend, fastapi_users

router = APIRouter()

# Signup
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# Login / logout (JWT)
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)

# Current user management (/users/me)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
