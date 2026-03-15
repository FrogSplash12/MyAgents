import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.agent import AutonomyMode, VerificationState


class AgentCreate(BaseModel):
    name: str = Field(..., max_length=255)
    agent_type: str = Field(..., max_length=100)
    owner_id: str | None = None
    issuer_id: str | None = None
    autonomy_mode: AutonomyMode = AutonomyMode.SEMI_AUTONOMOUS
    capabilities: dict | None = None
    runtime_provider: str | None = None
    surfaces: dict | None = None
    provenance: dict | None = None
    description: str | None = None


class AgentUpdate(BaseModel):
    name: str | None = None
    agent_type: str | None = None
    owner_id: str | None = None
    issuer_id: str | None = None
    autonomy_mode: AutonomyMode | None = None
    verification_state: VerificationState | None = None
    capabilities: dict | None = None
    runtime_provider: str | None = None
    surfaces: dict | None = None
    provenance: dict | None = None
    description: str | None = None


class AgentResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    name: str
    agent_type: str
    owner_id: str | None
    issuer_id: str | None
    autonomy_mode: AutonomyMode
    verification_state: VerificationState
    capabilities: dict | None
    runtime_provider: str | None
    surfaces: dict | None
    provenance: dict | None
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
