# 🤖 AgroBotics - Smart Agricultural Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.15-blue.svg)](https://mui.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()

Modern, professional React-based agricultural monitoring platform for **SIH 2025**. AgroBotics combines autonomous robotics, AI-powered analytics, and precision farming to revolutionize agriculture. This frontend provides an intuitive interface for real-time monitoring, intelligent insights, and seamless user experience.

---

## 🌟 Key Features

### 🏠 **Modern Landing Page**
- **Hero Section**: Eye-catching design with agricultural background imagery
- **Smooth Navigation**: Fixed header with smooth scrolling to sections
- **Team Showcase**: Professional team member profiles with actual photos
- **Feature Overview**: Comprehensive system capabilities with visual cards
- **Responsive Design**: Mobile-friendly navigation and layout

### 📊 **Real-time Dashboard**
- **Environmental Monitoring**: Temperature, humidity, soil moisture, pH levels
- **Live Data Updates**: WebSocket integration for real-time sensor data
- **AI Analysis Integration**: MATLAB engine results and predictive insights  
- **Clean Interface**: Standalone dashboard without sidebar navigation
- **Alert System**: Real-time notifications for critical conditions
- **Interactive Charts**: Historical data visualization with Recharts

### 🎨 **Professional Design**
- **Material-UI Components**: Modern, accessible component library
- **Agricultural Theme**: Green color scheme optimized for farming context
- **Framer Motion**: Smooth animations and transitions
- **Mobile Responsive**: Seamless experience across all devices

---

## 🛠️ Technology Stack

### **Core Framework**
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **React Router DOM**: Client-side routing for SPA navigation

### **UI & Styling**
- **Material-UI (MUI)**: Professional React component library
- **@emotion/react**: CSS-in-JS styling solution
- **Framer Motion**: Animation library for smooth transitions
- **Custom Theme**: Agricultural-optimized color palette

### **Data Management**
- **@tanstack/react-query**: Powerful server state management
- **Axios**: HTTP client for API communication
- **WebSocket**: Real-time data streaming

### **Visualization**
- **Recharts**: Modern data visualization built on D3
- **Interactive Charts**: Line charts, area charts, bar charts
- **Responsive Container**: Adaptive chart sizing

### **User Experience**
- **React Hot Toast**: Beautiful toast notifications
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders and progress indicators

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ 
- npm 7+
- Git

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd frontend-react

# Install dependencies
npm install

# Start development server
npm start
```

### **Environment Variables** (Optional)
Create a `.env.local` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### **Access the Application**
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

---

## 📱 Application Structure

### **Navigation Flow**
```
🏠 Landing Page (/)
├── Hero Section with CTA buttons
├── About Section with content & image
├── Features Section (8 system components)
├── Team Section (5 team members)
└── Contact Section

📊 Dashboard (/dashboard)
├── Header with AgroBotics branding
├── Environmental metrics (6 cards)
├── Real-time charts (24h trends)
├── AI analysis results
├── Device status monitoring
└── System information panel
```

### **Project Structure**
```
src/
├── components/
│   ├── Layout.tsx           # Main layout wrapper (unused in current setup)
│   └── MetricCard.tsx       # Environmental metric display cards
├── pages/
│   ├── AboutNew.tsx         # Landing page (root route)
│   └── Dashboard.tsx        # Monitoring dashboard (standalone)
├── contexts/
│   └── WebSocketContext.tsx # Real-time data management
├── services/
│   └── api.ts               # API client and HTTP requests
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main app with routing and theme
├── index.tsx                # Application entry point
└── index.css                # Global styles
```

---

## 🎯 Current Implementation

### **Landing Page Features**
- ✅ Modern hero section with Unsplash background
- ✅ Smooth scrolling navigation 
- ✅ Team member profiles with local photos
- ✅ System features showcase (8 components)
- ✅ Contact information and footer
- ✅ Mobile responsive design
- ✅ Framer Motion animations

### **Dashboard Features**
- ✅ Real-time environmental metrics (6 sensors)
- ✅ Historical data charts (24-hour trends)
- ✅ AI analysis integration (MATLAB results)
- ✅ Device status monitoring
- ✅ Alert system with notifications
- ✅ System information panel
- ✅ WebSocket connectivity with fallback
- ✅ Standalone interface (no sidebar)

### **Technical Implementation**
- ✅ TypeScript with strict mode
- ✅ React Query for data fetching
- ✅ Material-UI theming
- ✅ Error boundaries and loading states
- ✅ Responsive design breakpoints
- ✅ Performance optimizations

---

## 👥 Team Members

| Name | Role | Specialization |
|------|------|----------------|
| **Arnav Manwatkar** | Frontend Developer & AI/ML Engineer | Dashboard Development, Data Visualization, Computer Vision |
| **Radhika Aggrawal** | UI/UX Designer & Presentation Specialist | User Experience Design, Interface Design, Brand Identity |
| **Suryansh Singh** | Backend Developer & System Architect | MATLAB Integration, API Development, System Orchestration |
| **Aryan Nayak** | AI/ML Engineer & Data Engineer | Predictive Analytics, Data Pipeline, Feature Engineering |
| **Harshit** | IoT Engineer | Sensor Networks, MQTT Communication, Hardware Integration |

---

## 🔧 Development

### **Available Scripts**
```bash
npm start          # Development server (http://localhost:3000)
npm run build      # Production build
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### **Code Style**
- **TypeScript**: Full type coverage with interfaces
- **Functional Components**: React hooks pattern
- **Material-UI**: Consistent component usage
- **Error Handling**: Comprehensive error boundaries

### **Adding New Features**
1. **Define Types**: Add interfaces in `src/types/index.ts`
2. **API Integration**: Add endpoints in `src/services/api.ts`
3. **Components**: Create reusable components
4. **Pages**: Implement full page components
5. **Routing**: Update routes in `App.tsx`

---

## 🌐 API Integration

### **Backend Communication**
- **REST API**: HTTP requests for data fetching
- **WebSocket**: Real-time sensor data updates
- **Proxy**: Development proxy to backend server

### **Key Endpoints**
```typescript
GET  /api/sensors/latest     # Latest sensor readings
GET  /api/analysis/results   # AI analysis results  
POST /api/analysis/run       # Trigger new analysis
GET  /api/alerts             # Active alerts
GET  /api/data/history       # Historical sensor data
GET  /api/system/status      # System health status
WS   /ws                     # Real-time WebSocket
```

---

## 🚀 Production Deployment

### **Build for Production**
```bash
# Create optimized build
npm run build

# Test production build locally
npx serve -s build
```

### **Deployment Options**
- **Vercel**: `npm run build` → deploy `build/` folder
- **Netlify**: Connect Git repository for auto-deploy
- **Docker**: Use provided Dockerfile
- **Static Hosting**: Deploy `build/` to any CDN

### **Environment Variables**
```env
# Production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
```

---

## 🐛 Troubleshooting

### **Common Issues**

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Verify backend server is running on port 8000
- Check CORS configuration
- Confirm network connectivity

**WebSocket Connection**
- Ensure WebSocket endpoint is accessible
- Check firewall/proxy settings
- Verify URL format (`ws://` or `wss://`)

**Image Loading Issues**
- Photos should be in `public/images/` folder
- Use forward slash paths: `/images/filename.jpg`
- Check console for 404 errors

---

## 📈 Performance Features

- **React Query Caching**: Efficient data fetching with automatic caching
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Optimized assets and lazy loading
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Analysis**: Built-in webpack bundle analyzer

---

## 📄 License

This project is part of the **SIH 2025** submission and follows the project's licensing terms.

---

**🌾 Built with ❤️ by the AgroBotics Team | SIH 2025 🚀**

*Empowering farmers through technology and innovation*