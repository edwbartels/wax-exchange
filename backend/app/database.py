from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
SCHEMA = os.getenv("SCHEMA", None)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata = MetaData(schema=SCHEMA) if SCHEMA else None
Base = declarative_base(metadata=metadata)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from app.models import (
        Album,
        Artist,
        Item,
        Listing,
        Release,
        Review,
        Order,
        User,
    )

    Base.metadata.create_all(bind=engine)


def drop_tables():
    from app.models import (
        Album,
        Artist,
        Item,
        Listing,
        Release,
        Review,
        Order,
        User,
    )

    Base.metadata.drop_all(bind=engine)
