import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import Agent, AgentVersion
from app.schemas.agent import AgentCreate, AgentUpdate


async def create_agent(db: AsyncSession, tenant_id: uuid.UUID, data: AgentCreate) -> Agent:
    agent = Agent(tenant_id=tenant_id, **data.model_dump())
    db.add(agent)
    await db.flush()

    version = AgentVersion(
        agent_id=agent.id,
        version_number=1,
        snapshot=data.model_dump(mode="json"),
    )
    db.add(version)
    await db.flush()
    return agent


async def get_agent(db: AsyncSession, tenant_id: uuid.UUID, agent_id: uuid.UUID) -> Agent | None:
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def list_agents(
    db: AsyncSession, tenant_id: uuid.UUID, offset: int = 0, limit: int = 50
) -> list[Agent]:
    result = await db.execute(
        select(Agent)
        .where(Agent.tenant_id == tenant_id)
        .order_by(Agent.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    return list(result.scalars().all())


async def update_agent(
    db: AsyncSession, tenant_id: uuid.UUID, agent_id: uuid.UUID, data: AgentUpdate
) -> Agent | None:
    agent = await get_agent(db, tenant_id, agent_id)
    if agent is None:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(agent, key, value)

    # Get current max version
    result = await db.execute(
        select(AgentVersion.version_number)
        .where(AgentVersion.agent_id == agent_id)
        .order_by(AgentVersion.version_number.desc())
        .limit(1)
    )
    max_version = result.scalar_one_or_none() or 0

    version = AgentVersion(
        agent_id=agent_id,
        version_number=max_version + 1,
        snapshot=data.model_dump(mode="json", exclude_unset=True),
    )
    db.add(version)
    await db.flush()
    return agent
