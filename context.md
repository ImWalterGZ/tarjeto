## Project Overview

Tarjeto is an innovative digital ecosystem that transforms traditional customer loyalty programs into a modern, centralized, and automated solution. The system integrates proximity technologies (QR and NFC) to create a seamless experience for both users and commercial establishments.

<architecture>
- Mobile Application (Flutter)
- IoT Devices (ESP32-based)
- Web Application (React.js)
- Backend Server (Node.js/Express)
- Database (MongoDB)
</architecture>

<tech_stack>

- Frontend: React.js, Flutter
- Backend: Node.js with Express
- Database: MongoDB
- IoT: ESP32 microcontroller
- Communication: REST API
- Authentication: JWT
  </tech_stack>

## Component Details

<mobile_app>

- Built with Flutter for cross-platform support
- User profile management
- Digital loyalty card management
- QR code generation displaying user's public ID
- NFC functionality for contactless identification
- Google Wallet integration for loyalty cards
- Push notification reception
- No local database or offline synchronization
- Serves as digital replacement for physical loyalty cards
  </mobile_app>

<iot_device>

- ESP32-based microcontroller
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
- No local caching or offline functionality
- No advanced security features (basic authentication only)
  </iot_device>

<web_app>

- Two main components:
  1. Marketing landing page (responsive)
  2. Business management dashboard (desktop-focused)
- Built with React.js
- JWT authentication
- Chart.js for data visualization
- Features:
  - Analytics dashboard for business insights
  - Loyalty program configuration
  - Promotion management
  - Customer data visualization
- No marketing campaign tools or export capabilities
- No multi-factor authentication
  </web_app>

<backend>
- Node.js with Express
- MongoDB database
- REST API for all communications
- No WebSockets or MQTT
- JWT authentication
- Core functions:
  - User management
  - Loyalty card processing
  - Visit tracking
  - Business analytics
  - Promotion management
</backend>

## Integration Details

<communication>
- All components communicate via REST API
- No WebSockets implementation
- IoT devices require constant server connection
- "Real-time" refers to automated visit registration
- No offline data synchronization
- Server-centric data management
</communication>

<data_flow>

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
   </data_flow>

## Development Guidelines

<code_standards>

- Follow standard React practices for web development
- Use Flutter best practices for mobile development
- Implement RESTful API design principles
- Maintain clear separation of concerns
- Use descriptive variable and function names
- Document all API endpoints
- Write clean, maintainable code
  </code_standards>

<security_requirements>

- Basic authentication for IoT devices
- JWT authentication for web and mobile apps
- HTTPS for all API communications
- Input validation for all user inputs
- Standard password security practices
- No advanced security features initially
  </security_requirements>

## Project Goals

<objectives>
- Replace traditional paper loyalty cards with digital solution
- Automate visit tracking through IoT technology
- Provide businesses with customer insights and analytics
- Create intuitive mobile experience for end users
- Establish scalable platform for various business types
</objectives>

<success_metrics>

- User adoption rate
- Business participation
- Visit transaction volume
- Customer retention improvement
- User satisfaction
  </success_metrics>

## Implementation Notes

<priorities>
1. Core functionality over advanced features
2. Reliability over complexity
3. User experience over technical sophistication
4. Scalability for future enhancements
</priorities>

<limitations>
- No offline functionality for IoT devices
- No local caching in mobile app
- No advanced security features initially
- No marketing campaign tools in first version
- Desktop-focused business dashboard
</limitations>
</context>
