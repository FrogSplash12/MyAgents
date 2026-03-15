import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    tenant_id: uuid.UUID
    actor_id: uuid.UUID
    action: str = Field(..., max_length=100)
    target_id: str | None = None
    target_type: str | None = None
    source: str = Field(..., max_length=100)
    environment: str | None = None
    trace_id: str | None = None
    payload: dict | None = None


class EventResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    actor_id: uuid.UUID
    action: str
    target_id: str | None
    target_type: str | None
    source: str
    environment: str | None
    trace_id: str | None
    payload: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}
