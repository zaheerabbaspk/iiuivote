from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class CandidateCreate(BaseModel):
    name: str = Field(..., description="Candidate Name")
    position: str = Field(..., description="Position/Department")
    party: Optional[str] = Field(None, description="Political Party")
    election_id: Optional[str] = Field(None, alias="electionId")
    image_url: Optional[str] = Field(None, alias="imageUrl")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Zaheer",
                "position": "President",
                "party": "Party X",
                "electionId": "1",
                "imageUrl": "data:image/jpeg;base64,..."
            }
        }

class CandidateResponse(BaseModel):
    id: int
    name: str
    position: str
    party: Optional[str] = None
    election_id: Optional[str] = None
    image_url: Optional[str] = None
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
    party: Optional[str] = None
    election_id: Optional[str] = None
    image_url: Optional[str] = None
    votes_count: int
