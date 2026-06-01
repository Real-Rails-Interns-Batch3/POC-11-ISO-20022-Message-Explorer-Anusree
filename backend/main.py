"""
ISO 20022 Message Explorer — FastAPI Backend
Real Rails Intelligence Library | PoC #11 | Rail: Payments
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import messages, glossary, comparison, metadata

app = FastAPI(
    title="ISO 20022 Message Explorer API",
    description="Backend API for the Real Rails Intelligence Library — ISO 20022 Payment Message Explorer. Provides message parsing, validation, field glossary, and MT/MX comparison data.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(messages.router)
app.include_router(glossary.router)
app.include_router(comparison.router)
app.include_router(metadata.router)


@app.get("/", tags=["health"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "ISO 20022 Message Explorer API",
        "version": "1.0.0",
        "rail": "Payments",
        "endpoints": [
            "/api/messages",
            "/api/glossary",
            "/api/comparison",
            "/api/metadata",
            "/docs",
        ],
    }


@app.get("/api", tags=["health"])
def api_root():
    """API root with available endpoints."""
    return {
        "message": "ISO 20022 Message Explorer API",
        "routes": {
            "messages": "/api/messages — List, get, parse, validate messages",
            "glossary": "/api/glossary — Field definitions and search",
            "comparison": "/api/comparison — MT vs MX mapping",
            "metadata": "/api/metadata — Rail intelligence sidebar data",
        },
    }
