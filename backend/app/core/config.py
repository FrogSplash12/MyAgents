from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AuthKnot"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://authknot:authknot@localhost:5432/authknot"
    redis_url: str = "redis://localhost:6379/0"

    app_secret_key: str = "change-me-in-production"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    model_config = {"env_file": ".env"}


settings = Settings()
