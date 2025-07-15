# Tenant Admin API

## Introduction

This document outlines the product requirements for a new Tenant Admin API. This API will serve as the backend for the "Tenant Admin UI" (React App) and handle all the business logic, data processing, and database interactions required to provision new tenants.
The primary objective is to create a secure, scalable, and robust set of API endpoints that perform the creation of a complete tenant entity, including its associated customer, warehouse, user, custom entities, and settings. The API will be built using NodeJS and will enforce strict data isolation in a multi-tenant architecture.


## Tech Stack

- NodeJS
- Typescript
- Express
- MongoDb
- Docker

## High Level Design

- RESTful API Endpoints: A clear and predictable set of endpoints for creating tenants and retrieving necessary configuration data.
- Transactional Tenant Creation: An "all-or-nothing" approach to creating a tenant and its dependent entities.
- Payload Validation: Strict validation of all incoming data against predefined schemas.
- Secure Authentication: Endpoints will be protected and require proper authentication to prevent unauthorized access.
- Multi-Tenancy Enforcement: The API logic will be responsible for assigning and enforcing the tenant_id for all tenant-specific data.

## Features

- Create a new tenant
- Update a tenant
- Delete a tenant
- Get a tenant
- Get all tenants


## Data Model

Every tenant is associated with a customer, warehouse, user, custom entities, and settings.

### Tenant

Sample schema is available in the `sample-schemas/tenant.json` file. The tenant is the root entity that contains all the other entities.

### Customer

Sample schema is available in the `sample-schemas/customer.json` file. The customer is the entity that contains all the customer-specific data.

### Warehouse

Sample schema is available in the `sample-schemas/warehouse.json` file. The warehouse is the entity that contains all the warehouse-specific data.

### User

The user is the entity that contains all the user-specific data. Sample schema is available in the `sample-schemas/super-admin.json` file. This is the user that is created when a tenant is created and acts as the super admin for the tenant.

### Custom Entities

The custom entities are the entities that are not part of the core system and are specific to the tenant.

Custom entities can be of various types, for example: User Roles, Permissions, etc.

Sample schema is available in the `sample-schemas/associate-role.json` and `sample-schemas/admin-role.json` files.

