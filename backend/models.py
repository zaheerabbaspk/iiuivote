from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CandidateResponse(BaseModel):
    id: int
    name: str
    position: str
    votes_count: int

    class Config:
        from_attributes = True

class VoteRequest(BaseModel):
    user_id: int
    candidate_id: int

class VoteResponse(BaseModel):
    id: int
    user_id: int
    candidate_id: int
    vote_time: datetime

class ResultResponse(BaseModel):
    candidate_id: int
    name: str
    position: str
    votes_count: int
