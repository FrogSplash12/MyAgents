import uuid

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.agent import AgentCreate, AgentResponse, AgentUpdate
from app.services.agent_service import create_agent, get_agent, list_agents, update_agent

router = APIRouter(prefix="/agents", tags=["agents"])


def _get_tenant_id(x_tenant_id: str = Header(...)) -> uuid.UUID:
    try:
        return uuid.UUID(x_tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tenant ID")


@router.post("", response_model=AgentResponse, status_code=201)
async def register_agent(
    data: AgentCreate,
    tenant_id: uuid.UUID = Depends(_get_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    agent = await create_agent(db, tenant_id, data)
    return agent


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent_by_id(
    agent_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(_get_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    agent = await get_agent(db, tenant_id, agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.get("", response_model=list[AgentResponse])
async def list_agents_endpoint(
    offset: int = 0,
    limit: int = 50,
    tenant_id: uuid.UUID = Depends(_get_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    return await list_agents(db, tenant_id, offset, limit)


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent_endpoint(
    agent_id: uuid.UUID,
    data: AgentUpdate,
    tenant_id: uuid.UUID = Depends(_get_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    agent = await update_agent(db, tenant_id, agent_id, data)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent
