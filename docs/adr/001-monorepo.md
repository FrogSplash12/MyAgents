# ADR-001: Monorepo Structure

## Status
Accepted

## Context
AuthKnot has backend, worker, and multiple frontend surfaces that share types,
configuration, and deployment workflows.

## Decision
Use a single monorepo with top-level directories for each service/surface.

## Consequences
- Simplified cross-service refactoring
- Single CI pipeline with path-based job triggers
- Shared dev container configuration
