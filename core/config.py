"""Application settings, loaded from environment / .env file."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # ignore other keys in .env (Firebase, Gemini, etc.)
    )

    # App
    app_name: str = "Chia API"
    app_version: str = "0.1.0"

    # Auth — JWT signing secret. Override with SECRET_KEY in .env for production.
    secret_key: str = "CHANGE_ME_dev_only_secret"
    access_token_lifetime_seconds: int = 3600  # 1 hour

    # AI — Groq (Llama 3.1 8B Instant) for the swap engine
    groq_api_key: str
    groq_model: str = "llama-3.1-8b-instant"

    # Database — raw Supabase Postgres connection string (postgresql://...)
    database_url: str

    @property
    def async_database_url(self) -> str:
        """SQLAlchemy needs the asyncpg driver in the URL scheme."""
        url = self.database_url
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url


# BaseSettings loads required fields (database_url) from .env at runtime,
# so no constructor args are needed. type: ignore silences Pylance's false positive.
settings = Settings()  # type: ignore[call-arg]
