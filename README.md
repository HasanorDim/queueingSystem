Software Design Document
Queue Management System
Developer: Hasanor Dimasimapan
1. Introduction
1.1 Purpose
The purpose of this document is to define the software requirements for a Queueing Management System that enables organizations to manage customer flow efficiently through digital ticketing and real-time dashboards.
1.2 Scope
This system allows customers to request queue tickets, and admins/staff to view, update, and manage queues. It also supports role-based login, and monitor through dashboard. Also, covers implementation of:
•	Ticket creation/management
•	Real-time updates
•	Role-based access control
1.3 Intended Audience
•	LGU personnel and staff
•	Developers
1.4 Definitions
Term	- Definition
Ticket	- Virtual queue placeholder
Window	- Service desk
Department	specific division or section

2. Technical Specifications
Category	|| Technology Stack
Frontend Framework -> React 18 (JavaScript) + vite 6.0.5
State Management	-> Zustand 1.7.9
API Communication	-> Axios 1.3 
Backend Framework	-> Node.js v20.9.0 + Express.js
Database System	-> MySQL (xampp)
Authentication	-> JWT (cookie)
Realtime Services	-> socket.io-client 4.8.1 (Frontend) + socket.io 4.8.1 (Backend)
UI Components	-> Tailwind CSS 3.3 + daisyui


2.2 Component
Authentication Module
•	Validates JWT cookies
•	Enforces role-based access
•	Protect routes
Ticket Service
•	Manages ticket lifecycle
•	Broadcasts real-time updates

2. Functional Requirements
2.1 User Authentication
Requirement	Priority
System shall allow login via email/password	High
System shall enforce password complexity (min 6 chars)	Critical

2.2 Inventory Management
Requirement	Priority
Pharmacists shall view medicines expiring within 30 days	High
System shall prevent dispensing if stock ≤ 5 units	Critical
Admins shall batch-import medicines via CSV	Medium

3. Installation Guide

Install dependencies
•	cd frontend && npm install
•	cd backend && npm install
# Clone repository
•	git clone https://github.com/org/pharmacy-inventory.git

Configure environment:
•	PORT = 5001
•	HOST =localhost
•	USER =root
•	PASSWORD = 
•	DATABASE =QueueingDB
•	NODE_ENV = development
•	JWT_SECRET=your_secret_key

3.2 Running the System
Component	Command	Access
Backend	- npm run dev	localhost: 5001
Frontend	- npm run dev	localhost:5173
MySQL	- Start via XAMPP Control	localhost:3306

4 Development Setup
•	Start MySQL via XAMPP
•	Launch backend: npm start dev
•	Run frontend:  npm start dev

5. Constraints
•	Must use MySQL for database.
•	Frontend must use Zustand for state management.
•	Backend must expose RESTful APIs using Express.
•	Socket.IO must be used for real-time ticket updates.
6. Assumptions and Dependencies
•	Users have internet access.
•	Axios is available for HTTP communication.
•	Socket.IO is configured for real-time communication.

