# Tarjeto

A modern digital ecosystem that transforms traditional customer loyalty programs into a centralized, automated solution using proximity technologies (QR and NFC).
Preview: [tarjeto.app](www.tarjeto.app)

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Components](#components)
  - [Mobile Application](#mobile-application)
  - [IoT Device](#iot-device)
  - [Web Application](#web-application)
  - [Backend Server](#backend-server)
- [Integration & Data Flow](#integration--data-flow)
- [Development Guidelines](#development-guidelines)
- [Project Goals](#project-goals)
- [Current Limitations](#current-limitations)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Overview

Tarjeto is an innovative digital ecosystem that transforms traditional customer loyalty programs into a modern, centralized, and automated solution. The system integrates proximity technologies (QR and NFC) to create a seamless experience for both users and commercial establishments.

## Architecture

The Tarjeto ecosystem consists of the following components:

- Mobile Application (Flutter)
- IoT Devices (ESP32-based)
- Web Application (React.js)
- Backend Server (Node.js/Express)
- Database (MongoDB)

## Tech Stack

| Component      | Technology            |
| -------------- | --------------------- |
| Frontend       | React.js, Flutter     |
| Backend        | Node.js with Express  |
| Database       | MongoDB               |
| IoT            | ESP32 microcontroller |
| Communication  | REST API              |
| Authentication | JWT                   |

## Components

### Mobile Application

The Tarjeto mobile app serves as a digital replacement for physical loyalty cards:

- Built with Flutter for cross-platform support
- User profile management
- Digital loyalty card management
- QR code generation displaying user's public ID
- NFC functionality for contactless identification
- Google Wallet integration for loyalty cards
- Push notification reception

### IoT Device

ESP32-based device installed at business locations:

- QR scanner for reading user IDs
- NFC reader for contactless identification
- WiFi connectivity (requires constant connection)
- Display screen for showing customer information
- Process flow:
  1. Reads customer ID via QR or NFC
  2. Sends ID to server for verification
  3. Checks if customer has loyalty card for current business
  4. Registers visit by incrementing visit counter
  5. Displays current loyalty level on screen
  6. Shows available promotions based on loyalty level

### Web Application

The web component has two main parts:

1. **Marketing Landing Page**

   - Responsive design for all devices
   - Information about the Tarjeto ecosystem

2. **Business Management Dashboard**
   - Desktop-focused interface
   - JWT authentication
   - Chart.js for data visualization
   - Analytics dashboard for business insights
   - Loyalty program configuration
   - Promotion management
   - Customer data visualization

### Backend Server

The central nervous system of the Tarjeto ecosystem:

- Node.js with Express
- MongoDB database
- REST API for all communications
- JWT authentication
- Core functions:
  - User management
  - Loyalty card processing
  - Visit tracking
  - Business analytics
  - Promotion management

## Integration & Data Flow

All components communicate via REST API with the following flow:

1. User generates QR code or uses NFC in mobile app (containing userID)
2. IoT device reads userID from QR code or NFC
3. IoT device sends API request to server containing:
   - userID (identifies the customer)
   - deviceID (identifies the specific IoT device)
   - negocioID (identifies the business establishment)
4. Server processes this information to:
   - Verify user exists
   - Check if user has a loyalty card for this specific negocioID
   - If no card exists, create new loyalty card for this user-business pair
   - If card exists, increment visit counter
5. Server returns to IoT device:
   - User information
   - Current loyalty level
   - Visit count
   - Available promotions based on loyalty level
6. IoT device displays this information on screen
7. Server sends push notification to user's mobile app (when connected)
8. Mobile app updates loyalty card information on next connection

## Development Guidelines

### Code Standards

- Follow standard React practices for web development
- Use Flutter best practices for mobile development
- Implement RESTful API design principles
- Maintain clear separation of concerns
- Use descriptive variable and function names
- Document all API endpoints
- Write clean, maintainable code

### Security Requirements

- Basic authentication for IoT devices
- JWT authentication for web and mobile apps
- HTTPS for all API communications
- Input validation for all user inputs
- Standard password security practices

## Project Goals

### Objectives

- Replace traditional paper loyalty cards with digital solution
- Automate visit tracking through IoT technology
- Provide businesses with customer insights and analytics
- Create intuitive mobile experience for end users
- Establish scalable platform for various business types

### Success Metrics

- User adoption rate
- Business participation
- Visit transaction volume
- Customer retention improvement
- User satisfaction

### Priorities

1. Core functionality over advanced features
2. Reliability over complexity
3. User experience over technical sophistication
4. Scalability for future enhancements

## Current Limitations

- No offline functionality for IoT devices
- No local caching in mobile app
- No advanced security features initially
- No marketing campaign tools in first version
- Desktop-focused business dashboard

---

© 2025 Tarjeto. All rights reserved.
