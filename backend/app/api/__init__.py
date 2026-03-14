"""
API routes and dependencies module
"""
from app.api import deps
from app.api.endpoints import login, sales, predict

__all__ = ["deps", "login", "sales", "predict"]