# Promociones API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create Promotion](#create-promotion)
  - [Get All Promotions](#get-all-promotions)
  - [Get Promotion by ID](#get-promotion-by-id)
  - [Update Promotion](#update-promotion)
  - [Delete Promotion (Soft)](#delete-promotion-soft)
  - [Delete Promotion (Hard)](#delete-promotion-hard)
  - [Update Analytics](#update-analytics)
- [Models](#models)
- [Error Handling](#error-handling)

## Overview

This API provides endpoints to manage promotions in the Tarjeto platform. It includes functionality for creating, reading, updating, and deleting promotions, as well as tracking promotion analytics.

## Base URL

```
http://your-api-domain/api/promociones
```

## Authentication

All endpoints require authentication via JWT token (implementation details to be added).

## Endpoints

### Create Promotion

Create a new promotion for a business.

```http
POST /api/promociones/

Headers:
{
    "Content-Type": "application/json"
}

Body:
{
    "negocioID": "NEG12345678",
    "titulo": "2x1 en Hamburguesas",
    "descripcion": "Lleva dos hamburguesas por el precio de una",
    "tipo": "descuento",
    "nivelReq": 2,
    "fechaInicio": "2024-03-20T00:00:00.000Z",
    "fechaFin": "2024-04-20T23:59:59.999Z",
    "condiciones": [
        "Válido solo en sucursal principal",
        "No acumulable con otras promociones"
    ],
    "beneficio": {
        "tipo": "porcentaje",
        "valor": 50
    },
    "limites": {
        "usosPorCliente": 1,
        "usosTotal": 100
    }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789"
    // ... rest of promotion data
  }
}
```

### Get All Promotions

Retrieve all promotions with optional filters.

```http
GET /api/promociones/

Optional Query Parameters:
?negocioID=NEG12345678    // Filter by business
?activo=true              // Filter by active status
?nivelReq=2              // Filter by required level

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f4c3d123456789",
      "titulo": "2x1 en Hamburguesas"
      // ... rest of promotion data
    }
    // ... more promotions
  ]
}
```

### Get Promotion by ID

Retrieve a specific promotion by its ID.

```http
GET /api/promociones/:id

Example: GET /api/promociones/65f4c3d123456789

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789",
    "titulo": "2x1 en Hamburguesas"
    // ... rest of promotion data
  }
}
```

### Update Promotion

Update an existing promotion.

```http
PUT /api/promociones/:id

Example: PUT /api/promociones/65f4c3d123456789

Headers:
{
    "Content-Type": "application/json"
}

Body: (include only fields to update)
{
    "titulo": "3x2 en Hamburguesas",
    "activo": true,
    "limites": {
        "usosPorCliente": 2,
        "usosTotal": 200
    }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789"
    // ... updated promotion data
  }
}
```

### Delete Promotion (Soft)

Deactivate a promotion (soft delete).

```http
DELETE /api/promociones/:id

Example: DELETE /api/promociones/65f4c3d123456789

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789",
    "activo": false
    // ... rest of promotion data
  }
}
```

### Delete Promotion (Hard)

Permanently delete a promotion (admin only).

```http
DELETE /api/promociones/:id/hard

Example: DELETE /api/promociones/65f4c3d123456789/hard

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "message": "Promoción eliminada permanentemente"
}
```

### Update Analytics

Update promotion view or usage statistics.

```http
POST /api/promociones/:id/analytics

Example: POST /api/promociones/65f4c3d123456789/analytics

Headers:
{
    "Content-Type": "application/json"
}

Body:
{
    "tipo": "vista",  // or "uso"
    "hora": 14        // hour of the day (0-23)
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789",
    "analitica": {
      "vistas": 1,
      "usos": 0,
      "promedioVistaUso": 0,
      "popularidadPorHora": [
        {
          "hora": 14,
          "usos": 0
        }
      ]
    }
    // ... rest of promotion data
  }
}
```

## Models

### Promotion Schema

```javascript
{
    negocioID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        required: true
    },
    titulo: String,
    descripcion: String,
    tipo: String,
    nivelReq: Number,
    fechaInicio: Date,
    fechaFin: Date,
    condiciones: [String],
    beneficio: {
        tipo: String,
        valor: Number
    },
    limites: {
        usosPorCliente: Number,
        usosTotal: Number
    },
    activo: {
        type: Boolean,
        default: true
    },
    analitica: {
        vistas: Number,
        usos: Number,
        promedioVistaUso: Number,
        popularidadPorHora: [{
            hora: Number,
            usos: Number
        }]
    }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side issue

### Examples of Error Responses

#### Resource Not Found

```json
{
  "success": false,
  "message": "Promoción no encontrada"
}
```

#### Invalid Input

```json
{
  "success": false,
  "message": "Datos de promoción inválidos"
}
```

#### Authentication Error

```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```
