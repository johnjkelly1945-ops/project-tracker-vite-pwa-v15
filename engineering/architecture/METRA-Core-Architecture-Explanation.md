# METRA — Core Architecture Explanation

## Purpose

This document provides a human-readable explanation of the METRA core architecture.

It explains the purpose of the major architectural elements, their relationships, and the principles that guide system evolution.

This document complements the SEM architecture documents and the METRA engineering canon.

---

# Architectural Principle

METRA is built on a central principle:

> Responsibility should reside with the correct owner, and the system should provide clear pathways to that owner.

The architecture separates:

- context
- work
- responsibility
- capability
- lifecycle ownership

This allows METRA to evolve while preserving clarity.

---

# Core Architectural Model

The primary METRA relationship is:

Segment

↓

Context

↓

Task

↓

Constitutional Routing

↓

Workspace

↓

Provider

↓

Capability


Each element has a defined purpose.

No element should absorb responsibilities belonging elsewhere.

---

# Segment

## Purpose

Provides the bounded area in which activity exists.

## Explanation

A segment represents an area of activity, responsibility, or focus.

Examples include:

- project
- programme
- operational activity

Segments provide context but do not define the entire purpose of METRA.

---

# Context

## Purpose

Provides understanding of the environment surrounding work.

## Explanation

Context identifies the information required to understand a segment.

It provides meaning around ownership, relationships, and purpose.

---

# Task

## Purpose

Converts intent into observable action.

## Explanation

Tasks represent work requiring attention, ownership, progress, or decision.

Tasks provide operational focus but do not own specialised governance capabilities.

---

# Repository

## Purpose

Maintains authoritative system information.

## Explanation

Repositories contain the trusted source information from which views, summaries, and projections are derived.

Derived views must not become competing sources of truth.

---

# Constitutional Routing

## Purpose

Directs responsibility to the correct owner.

## Explanation

Constitutional routing prevents presentation surfaces from becoming responsible for decisions that belong to specialised owners.

It establishes the pathway between intent and capability ownership.

---

# Workspace

## Purpose

Provides the controlled environment where a capability is experienced.

## Explanation

A workspace defines the boundary around a particular capability.

Examples include:

- Risk Workspace
- Issue Workspace
- QC Workspace
- Advisory Workspace

---

# Provider

## Purpose

Owns capability lifecycle behaviour.

## Explanation

Providers manage lifecycle responsibility behind workspaces.

This separation prevents user interface components from becoming owners of system behaviour.

---

# Capability

## Purpose

Provides specialised system behaviour.

## Explanation

Capabilities allow METRA to support specific forms of engagement.

Examples include:

- risk management
- issue management
- quality management
- advisory engagement

---

# Governance

## Purpose

Provides controlled oversight within operational activity.

## Explanation

Governance operates alongside work rather than as a separate reporting layer.

It supports identification, management, and response to matters requiring control or decision.

---

# Projection

## Purpose

Provides derived understanding from authoritative information.

## Explanation

Projections create views of information without changing ownership or source authority.

Projection architecture remains subject to future architectural review.

---

# Evidence and Architectural Memory

## Purpose

Preserves the reasoning behind system evolution.

## Explanation

METRA records significant architectural change through:

- stage records
- SEM documents
- canon documents
- evidence archives
- decision records

This ensures that architectural knowledge is retained.

---

# Relationship to SEM and Canon

This document explains the architecture.

SEM documents define architectural models and constraints.

Canon documents define approved methods and practices.

Relationship:

Architecture Explanation

↓

SEM

↓

Canon

↓

Implementation

---

# Stage 500 Architectural Achievement

Stage 500 completed the constitutional governance migration.

The achievement was the separation of:

- operational presentation
- constitutional routing
- workspace ownership
- provider lifecycle
- capability behaviour

The resulting architecture provides a foundation for controlled future evolution.

---

# Future Evolution Principle

Future changes should follow:

Identify responsibility.

Identify current owner.

Identify future owner.

Inspect the hand-off.

Confirm the constitutional contract.

Change only the required seam.

---

# Status

Created following:

Stage 500 — Constitutional Governance Migration

Baseline:

baseline-2026-07-31-stage500-complete-constitutional-governance-migration

Purpose:

To preserve a durable explanation of the METRA architecture for engineering and future development.
