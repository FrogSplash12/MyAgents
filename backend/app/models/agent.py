import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class VerificationState(str, PyEnum):
    UNVERIFIED = "unverified"
    SELF_DECLARED = "self_declared"
    PLATFORM_VERIFIED = "platform_verified"
    OWNER_VERIFIED = "owner_verified"
    ISSUER_VERIFIED = "issuer_verified"
    REVOKED = "revoked"


class AutonomyMode(str, PyEnum):
    FULLY_AUTONOMOUS = "fully_autonomous"
    SEMI_AUTONOMOUS = "semi_autonomous"
    HUMAN_IN_THE_LOOP = "human_in_the_loop"
    SCRIPTED = "scripted"


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    agent_type: Mapped[str] = mapped_column(String(100), nullable=False)
    owner_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    issuer_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    autonomy_mode: Mapped[str] = mapped_column(
        Enum(AutonomyMode, name="autonomy_mode_enum"),
        default=AutonomyMode.SEMI_AUTONOMOUS,
    )
    verification_state: Mapped[str] = mapped_column(
        Enum(VerificationState, name="verification_state_enum"),
        default=VerificationState.UNVERIFIED,
    )
    capabilities: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    runtime_provider: Mapped[str | None] = mapped_column(String(255), nullable=True)
    surfaces: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    provenance: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class AgentVersion(Base):
    __tablename__ = "agent_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    version_number: Mapped[int] = mapped_column(nullable=False)
    snapshot: Mapped[dict] = mapped_column(JSONB, nullable=False)
    changed_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
