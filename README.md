# SparkUp - Startup Social Platform Documentation

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [Features Implementation](#features-implementation)
5. [Requirements Coverage](#requirements-coverage)
6. [Additional Features](#additional-features)
7. [Environment Variables](#environment-variables)
8. [Known Limitations & Future Improvements](#known-limitations--future-improvements)
9. [Contributing](#contributing)

---

## 1. Tech Stack Overview

### Frontend Technologies

- **React 18.3.1**: Latest version of React with improved rendering and concurrent features
- **TypeScript**: For type-safe code development
- **Vite**: Modern build tool for faster development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: High-quality React components built on Radix UI
- **Axios**: HTTP client for API requests
- **Zustand**: Lightweight state management
- **React Router Dom**: For client-side routing
- **@react-oauth/google**: Google OAuth integration
- **Browser Image Compression**: For optimizing uploaded images

### Backend Technologies

- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: For authentication
- **bcrypt**: Password hashing
- **nodemailer**: For email notifications
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **Hosted on AWS S3**: Backend is deployed on AWS S3 for scalability and reliability

---

## 2. Project Structure

The project follows a client-server architecture with clear separation of concerns:

### Client Structure

Organized into components, services, and assets for maintainable development.

### Server Structure

Follows MVC (Model-View-Controller) design for scalability and ease of debugging.

---

## 3. Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** instance
- **Google OAuth credentials**

### Local Development Setup

#### Clone the repository:

```bash
# Clone the repository
git clone <repository-url>
```

#### Server Setup:

```bash
cd server
npm install
npm start
```

The server will be running at: `http://localhost:3000`

#### Client Setup:

```bash
cd client
npm install
npm run dev
```

The application will be available at: `http://localhost:5173`

---

## 4. Features Implementation

### Authentication System

- **JWT-based authentication**
- **Google OAuth integration**
- **Anonymous browsing support**

### Startup Management

- Complete **CRUD operations**
- Team management with roles
- Timeline tracking

### Feed System

- Rich text posts with **Markdown support**
- Image upload with compression
- Interactive engagement features

### Project & Product Management

- Separate sections for service-based and product-based startups
- **Project portfolio** with client testimonials
- **Product showcase** with pricing and purchase links

### Search & Discovery

- Advanced search functionality with filters
- **Industry-based filtering**
- **Location-based search capabilities**
- Real-time search suggestions

### Notification System

- Real-time notifications for:
  - Post interactions
  - Team invitations
  - Join requests
  - Timeline updates
  - Product launches

---

## 5. Requirements Coverage

### Day 1 Requirements ✅

- **User Management**: Authentication system, profile management, and startup association
- **Startup Profile**: Comprehensive profile creation, timeline feature, and industry categorization
- **Feed System**: Markdown support, image attachments, and Like/Comment functionality
- **Search**: Industry filters
- **Anonymous Mode**: Limited access implementation with anonymous interaction tracking

### Day 2 Requirements ✅

- **Sharable Profiles**: Unique URLs for profiles and posts
- **Organization Management**: Role-based access control and team management
- **Project Portfolio**: Service showcase and client testimonials
- **Product Showcase**: Product cards with pricing
- **Hybrid Support**: Combined project/product features

### Day 3 Requirements ⚠️ (Partial Implementation)

- **Automatic Subscriptions**: Team member notifications
- **Optional Subscriptions**: Follow system
- **Event Management** (Partially Implemented): Basic event creation and RSVP system
- **Calendar Integration** (Not Implemented)

---

## 6. Additional Features

### Enhanced Security

- Image compression before upload
- JWT refresh tokens
- Rate limiting on API endpoints
- Input sanitization

### UI/UX Improvements

- Dark/Light mode toggle
- Responsive design
- Loading states
- Error boundaries
- Toast notifications

### Performance Optimizations

- Image lazy loading
- Infinite scroll for feeds
- Debounced search
- Caching strategies

---

## 7. Environment Variables

### Client (.env)

Specify API endpoints and environment-specific variables.

### Server (.env)

Define database credentials, JWT secrets, and OAuth configurations.

---

## 8. Known Limitations & Future Improvements

### Real-time Features

- Implement WebSocket for real-time messaging
- Live notifications

### Performance

- Implement server-side pagination
- Add Redis caching
- Optimize image delivery

### Features

- Complete calendar integration
- Enhanced event management
- Mobile app development

---

##

