# 🌾 AgriTech React Dashboard - SIH 2025

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.15-blue.svg)](https://mui.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()

Modern, professional React-based agricultural monitoring dashboard for the **SIH 2025 AgriTech Innovators** project. This is the **primary frontend interface** featuring real-time data visualization, AI-powered insights, and farmer-friendly design.

## 🌟 Key Features

### 🔄 **Real-time Monitoring**
- **WebSocket Integration**: Live sensor data updates without page refresh
- **Automatic Reconnection**: Robust connection management with fallback to polling
- **Real-time Alerts**: Instant notifications for critical conditions
- **Live Charts**: Dynamic data visualization with smooth animations

### 🎨 **Modern User Interface**
- **Material-UI (MUI)**: Professional, accessible components
- **Agricultural Theme**: Custom green color scheme optimized for farmers
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme adaptation for different environments
- **Accessibility**: WCAG 2.1 compliant for inclusive usage

### 🧠 **AI-Powered Insights**
- **MATLAB Integration**: Display of advanced analysis results
- **Predictive Analytics**: Future condition forecasting with confidence levels
- **Hyperspectral Analysis**: Crop health assessment from imaging data
- **Smart Alerts**: Context-aware notifications with severity levels

### 📊 **Advanced Data Visualization**
- **Interactive Charts**: Recharts-powered data visualization
- **Historical Trends**: Time-series analysis with customizable ranges
- **Comparative Views**: Multi-sensor data comparison
- **Export Capabilities**: Data export for further analysis

### 🔒 **Enterprise Features**
- **TypeScript**: Full type safety and better developer experience
- **Error Boundaries**: Graceful error handling and recovery
- **Performance Optimization**: React Query for efficient data fetching
- **Code Splitting**: Optimized loading and bundle sizes

---

## 🛠️ Technology Stack

### **⚛️ Core Framework**
- **React 18.2.0**: Modern React with concurrent features, hooks, and Suspense
- **TypeScript 4.9.5**: Complete type safety and enhanced developer experience
- **React Router DOM 6.22.3**: Modern client-side routing with data loading

### **🎨 UI Framework & Styling**
- **Material-UI (MUI) 5.15.15**: Professional React component library
- **@emotion/react & @emotion/styled**: CSS-in-JS styling solution
- **@mui/icons-material**: Comprehensive icon library
- **Custom Agricultural Theme**: Optimized color palette for farming applications

### **📊 Data Management & Visualization**
- **@tanstack/react-query 5.28.9**: Powerful server state management with caching
- **Axios 1.6.8**: Promise-based HTTP client with interceptors
- **Recharts 2.12.2**: Modern data visualization library built on D3
- **Socket.io Client 4.7.5**: Real-time WebSocket communication

### **🔔 User Experience**
- **React Hot Toast 2.4.1**: Beautiful, accessible toast notifications
- **React Testing Library**: Comprehensive testing utilities
- **Web Vitals**: Performance monitoring and optimization

---

## 🚀 **Quick Start Guide**

### **🏁 For Judges & Evaluators**

#### **Option 1: Complete System (Recommended)**
```bash
# 1. Start the API Server (in one terminal)
cd ../api
pip install -r requirements.txt
python app.py

# 2. Start React Dashboard (in another terminal)
cd frontend-react
npm install
npm start
```

🌐 **API Server**: http://localhost:8000  
⚛️ **React Dashboard**: http://localhost:3002  
🎆 **Live Demo**: Real-time WebSocket updates, AI insights, mobile-responsive

#### **Option 2: Frontend Only (Development Mode)**
```bash
# Quick frontend-only testing
npm install
npm start
```

⚠️ *Note: Some features require the API server for full functionality*

### **👨‍💻 For Development Team**

#### **Prerequisites**
- **Node.js 16+**: [Download here](https://nodejs.org/)
- **npm 7+**: Comes with Node.js
- **Git**: For version control
- **VS Code** (recommended): With TypeScript and React extensions

#### **Environment Setup**
```bash
# 1. Clone the repository
git clone <repository-url>
cd SIH-2025/frontend-react

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional)
cp .env.example .env.local
# Edit .env.local with your API endpoints

# 4. Start development server
npm start
```

#### **Environment Variables**
Create a `.env.local` file in the project root:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws

# Feature Flags
REACT_APP_ENABLE_MOCK_DATA=false
REACT_APP_DEBUG_MODE=false
```

---

## 📞 **Project Structure**

```
frontend-react/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   └── MetricCard.tsx     # Sensor metric display cards
│   ├── contexts/              # React contexts
│   │   └── WebSocketContext.tsx # WebSocket connection management
│   ├── pages/                 # Application pages
│   │   └── Dashboard.tsx      # Main dashboard page
│   ├── services/              # API and external services
│   │   └── api.ts            # API client and functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # All application types
│   ├── App.tsx               # Main application component
│   ├── index.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## 🚦 Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- AgriTech API Server running on port 8000

## ⚡ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file (optional):
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_WS_URL=ws://localhost:8000/ws
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Integration

The React app communicates with the backend API server. Default configuration:

- **API Base URL**: `http://localhost:8000`
- **WebSocket URL**: `ws://localhost:8000/ws`
- **Proxy**: Configured in `package.json` for development

### WebSocket Connection

Real-time features require the WebSocket connection to be established:

- Automatic reconnection on connection loss
- Real-time sensor data updates
- Live analysis result notifications
- System alerts and status updates

---

## 📊 **Dashboard Features & Usage**

### **🎆 Main Dashboard Overview**

#### **📈 Real-time Metrics Cards**
- **Temperature Monitoring**: Environmental temperature with status indicators
- **Humidity Tracking**: Air humidity levels with optimal range guidance
- **Soil Moisture**: Ground moisture content with irrigation recommendations
- **pH Level Monitoring**: Soil acidity/alkalinity with adjustment suggestions
- **Light Intensity**: Ambient light measurement for photosynthesis optimization
- **Battery Status**: IoT device power levels with maintenance alerts

#### **📊 Interactive Data Visualization**
- **Environmental Trends**: Multi-line charts showing historical patterns
- **Comparative Analysis**: Side-by-side sensor data comparison
- **Time Range Selection**: Flexible time periods (1h, 6h, 24h, 7d, 30d)
- **Export Functionality**: Download charts as PNG or data as CSV
- **Zoom & Pan**: Detailed exploration of specific time periods

#### **🧠 AI Analysis Results**
- **Crop Health Score**: Overall field health percentage with confidence levels
- **NDVI Analysis**: Normalized Difference Vegetation Index calculations
- **Stress Prediction**: Future condition forecasting with alert thresholds
- **Hyperspectral Insights**: Advanced imaging analysis results
- **Recommendations**: Actionable farming advice based on AI analysis

#### **🚨 Smart Alert System**
- **Severity Levels**: Critical, Warning, Info categorization with color coding
- **Real-time Notifications**: Instant toast notifications for urgent issues
- **Alert History**: Complete log of all alerts with timestamps
- **Dismissal Management**: Mark alerts as resolved or acknowledged
- **Custom Thresholds**: Configurable alert parameters per metric

### **📱 Device Management**
- **Connection Status**: Real-time IoT device connectivity monitoring
- **Last Update Tracking**: Timestamp display for each sensor reading
- **Device Configuration**: Remote settings adjustment capabilities
- **Battery Monitoring**: Power level tracking for solar-powered devices
- **Signal Strength**: Network connectivity quality indicators

### **⚙️ System Information Panel**
- **System Status**: Overall health of the monitoring system
- **MATLAB Engine**: Backend processing engine status
- **Database Connection**: Data storage system health
- **Uptime Statistics**: System reliability metrics
- **Connected Devices**: Count and status of active IoT sensors

---

## 🕹️ **User Interface Guide**

### **🏠 Navigation Structure**
```
🌾 AgriTech Dashboard
├── 🏠 Dashboard (Main)
│   ├── Real-time Metrics
│   ├── Environmental Charts
│   ├── AI Analysis Results
│   └── System Status
├── 📊 Analytics (Future)
├── ⚙️ Settings (Future)
└── 📝 Reports (Future)
```

### **📱 Responsive Design**
- **Desktop (1200px+)**: Full grid layout with all features visible
- **Tablet (768px-1199px)**: Responsive grid with collapsible sections
- **Mobile (320px-767px)**: Stacked layout optimized for touch interaction
- **Print-friendly**: Optimized layouts for report printing

### **♿ Accessibility Features**
- **Keyboard Navigation**: Full app navigation without mouse
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast display modes
- **Font Scaling**: Responsive to browser font size settings
- **Focus Management**: Clear focus indicators and logical tab order

### Metric Cards

- **Temperature**: Environmental temperature monitoring
- **Humidity**: Air humidity levels
- **Soil Moisture**: Ground moisture content
- **pH Level**: Soil acidity/alkalinity
- **Light Intensity**: Ambient light measurement
- **Battery Level**: Device battery status

### Data Visualization

- **Environmental Trends**: Historical data charts
- **Real-time Updates**: Live sensor readings
- **Analysis Results**: AI/ML model outputs
- **Device Status**: IoT device monitoring

### Alert System

- **Severity Levels**: Info, Warning, Error, Critical
- **Real-time Notifications**: Toast notifications for alerts
- **Alert Management**: View and dismiss alerts

---

## 🔗 **API Integration & Endpoints**

### **🌐 Backend Communication**

The React dashboard communicates with the FastAPI backend through:
- **REST API**: Traditional HTTP requests for data fetching and commands
- **WebSocket**: Real-time bidirectional communication for live updates
- **Proxy Configuration**: Development proxy to `http://localhost:8000`

### **📝 API Endpoints Used**

#### **System & Health**
```typescript
GET  /api/health              // API health check
GET  /api/system/status       // System status and uptime
GET  /api/system/info         // System information and metrics
```

#### **Sensor Data**
```typescript
GET  /api/sensors/latest      // Latest sensor readings from all devices
GET  /api/sensors/{device_id} // Specific device sensor data
GET  /api/data/history        // Historical sensor data with filters
GET  /api/data/export         // Export historical data (CSV/JSON)
```

#### **AI Analysis**
```typescript
GET  /api/analysis/results    // Latest AI analysis results
POST /api/analysis/run        // Trigger new analysis
GET  /api/analysis/history    // Historical analysis results
GET  /api/analysis/models     // Available AI models and status
```

#### **Alert Management**
```typescript
GET  /api/alerts              // Active alerts and notifications
POST /api/alerts/{id}/dismiss // Mark alert as dismissed
GET  /api/alerts/history      // Alert history with filters
```

#### **Device Management**
```typescript
GET  /api/devices             // List all connected devices
GET  /api/devices/{id}/status // Individual device status
POST /api/devices/{id}/command// Send command to device
```

### **⚡ WebSocket Events**

#### **Incoming Events (Backend → Frontend)**
```typescript
'sensor_update'        // Real-time sensor data updates
'analysis_complete'    // AI analysis completion notification
'analysis_error'       // Analysis failure notification
'new_alert'           // New alert/warning generated
'alert_dismissed'     // Alert dismissed by system
'device_connected'    // IoT device connection event
'device_disconnected' // IoT device disconnection event
'keepalive'          // Connection heartbeat
```

#### **Outgoing Events (Frontend → Backend)**
```typescript
'ping'                // Connection health check
'subscribe_device'    // Subscribe to specific device updates
'unsubscribe_device'  // Unsubscribe from device updates
'request_analysis'    // Request immediate analysis
```

---

## 🛠️ **Development Guide**

### **📋 Development Workflow**

#### **Code Structure Best Practices**
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Navigation and layout wrapper
│   ├── MetricCard.tsx   # Sensor data display cards
│   └── charts/         # Chart components
├── pages/              # Full page components
│   └── Dashboard.tsx    # Main dashboard page
├── contexts/           # React context providers
│   └── WebSocketContext.tsx # Real-time data management
├── services/           # API integration layer
│   └── api.ts          # HTTP client and API functions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript definitions
    └── index.ts        # All application interfaces
```

#### **Adding New Features**

1. **Create Types**: Define TypeScript interfaces in `src/types/index.ts`
```typescript
export interface NewFeature {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}
```

2. **Add API Functions**: Create API endpoints in `src/services/api.ts`
```typescript
export const getNewFeatureData = async (): Promise<NewFeature[]> => {
  const response = await apiClient.get('/api/new-feature');
  return response.data;
};
```

3. **Create Components**: Build reusable components
```typescript
interface NewFeatureCardProps {
  data: NewFeature;
  onUpdate?: (data: NewFeature) => void;
}

const NewFeatureCard: React.FC<NewFeatureCardProps> = ({ data, onUpdate }) => {
  // Component implementation
};
```

4. **Integrate with Dashboard**: Add to main dashboard or create new page

### **🧪 Testing Strategy**

#### **Unit Testing**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

#### **Testing Components**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';

test('renders dashboard with sensor data', async () => {
  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
  });
});
```

#### **Integration Testing**
```bash
# Start backend server
cd ../api && python app.py

# Run integration tests
npm run test:integration
```

The React app integrates with these backend endpoints:

- `GET /api/health` - Health check
- `GET /api/system/status` - System status
- `GET /api/sensors/latest` - Latest sensor data
- `GET /api/analysis/results` - Analysis results
- `POST /api/analysis/run` - Trigger analysis
- `GET /api/alerts` - Active alerts
- `GET /api/data/history` - Historical data
- `WebSocket /ws` - Real-time data stream

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Development

### Code Organization

- **Components**: Reusable UI components with TypeScript props
- **Pages**: Full-page components for routing
- **Services**: API integration and external service calls
- **Types**: TypeScript interfaces and type definitions
- **Contexts**: React context providers for global state

### Best Practices

- **TypeScript**: Full type safety with interfaces
- **Component Pattern**: Functional components with hooks
- **State Management**: React Query for server state, Context for UI state
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Responsive Design**: Mobile-first approach with MUI breakpoints

### Adding New Features

1. **Create Types**: Add interfaces in `src/types/index.ts`
2. **API Functions**: Add API calls in `src/services/api.ts`
3. **Components**: Create reusable components in `src/components/`
4. **Integration**: Use React Query for data fetching
5. **WebSocket**: Handle real-time updates in context

## 🔧 Customization

### Theming

Modify the MUI theme in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E8B57', // Sea Green
    },
    // ... other theme options
  },
});
```

### Adding Charts

Using Recharts for data visualization:

```tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <XAxis dataKey="time" />
    <YAxis />
    <Line type="monotone" dataKey="value" stroke="#2E8B57" />
  </LineChart>
</ResponsiveContainer>
```

---

## 🚀 **Production Deployment**

### **🏠 Build for Production**

#### **Optimized Production Build**
```bash
# Create optimized build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Test production build locally
npm install -g serve
serve -s build -l 3000
```

#### **Build Output**
```
build/
├── static/
│   ├── css/         # Optimized CSS files
│   ├── js/          # Minified JavaScript bundles
│   └── media/       # Optimized images and assets
├── index.html      # Main HTML file
├── manifest.json   # PWA manifest
└── robots.txt      # Search engine instructions
```

### **🌐 Deployment Options**

#### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

#### **Option 2: Netlify**
```bash
# Build and deploy
npm run build

# Drag and drop 'build' folder to Netlify dashboard
# Or connect Git repository for automatic deployments
```

#### **Option 3: Docker Container**
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run Docker container
docker build -t agritech-dashboard .
docker run -p 80:80 agritech-dashboard
```

#### **Option 4: Static Hosting**
```bash
# Build for static hosting
npm run build

# Upload 'build' folder to:
# - AWS S3 + CloudFront
# - Firebase Hosting
# - GitHub Pages
# - Any static hosting service
```

### **⚙️ Environment Configuration**

#### **Production Environment Variables**
```env
# .env.production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
REACT_APP_ENABLE_MOCK_DATA=false
REACT_APP_DEBUG_MODE=false
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

#### **NGINX Configuration (if using)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://your-api-server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket proxy
    location /ws {
        proxy_pass http://your-api-server:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 🔧 **Troubleshooting Guide**

### **🚫 Common Issues & Solutions**

#### **Build Errors**

**Issue**: TypeScript compilation errors
```bash
Error: TypeScript error in src/components/Dashboard.tsx
```
**Solution**:
```bash
# Check for type errors
npm run type-check

# Fix TypeScript errors and re-run
npm run build
```

**Issue**: Dependency conflicts
```bash
Error: Module not found
```
**Solution**:
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Runtime Errors**

**Issue**: API connection failed
```
Error: Network request failed
```
**Solutions**:
1. Verify API server is running on correct port
2. Check CORS configuration in API server
3. Verify proxy configuration in `package.json`
4. Check environment variables

**Issue**: WebSocket connection issues
```
WebSocket connection failed
```
**Solutions**:
1. Verify WebSocket URL format: `ws://localhost:8000/ws`
2. Check firewall/proxy settings
3. Ensure WebSocket endpoint is available
4. Check browser console for specific error messages

#### **Performance Issues**

**Issue**: Slow loading times
**Solutions**:
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
# Consider lazy loading for large components
# Enable service worker caching
```

**Issue**: High memory usage
**Solutions**:
- Check for memory leaks in useEffect cleanup
- Optimize large datasets with virtualization
- Use React.memo for expensive components

### **🔍 Debug Mode**

#### **Enable Debug Features**
```env
# .env.local
REACT_APP_DEBUG_MODE=true
```

#### **Debug Information Available**
- WebSocket connection status
- API request/response logging
- Component render counts
- Performance metrics
- Error boundaries with stack traces

---

## 📈 **Performance Optimization**

### **⚡ Optimization Features**

#### **Built-in Optimizations**
- **React Query Caching**: Intelligent data fetching with automatic caching
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Dead code elimination in production builds
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Analysis**: Built-in bundle size analysis

#### **Performance Monitoring**
```typescript
// Web Vitals reporting
import { reportWebVitals } from './reportWebVitals';

// Report performance metrics
reportWebVitals(console.log);
```

#### **Optimization Checklist**
- [x] React.memo for expensive components
- [x] useMemo for expensive calculations
- [x] useCallback for stable function references
- [x] Lazy loading for non-critical components
- [x] Service worker for caching
- [x] Optimized images and assets

---

## 🕰️ **Project Timeline & Milestones**

### **🏁 Development Progress**

| Phase | Status | Completion | Description |
|-------|--------|------------|-------------|
| **🔰 Setup** | ✅ Complete | 100% | Project initialization, dependencies |
| **🎨 UI Framework** | ✅ Complete | 100% | Material-UI integration, theming |
| **📊 Dashboard** | ✅ Complete | 100% | Main dashboard with all core features |
| **⚡ Real-time** | ✅ Complete | 100% | WebSocket integration, live updates |
| **🧠 AI Integration** | ✅ Complete | 95% | MATLAB backend integration |
| **📱 Responsive** | ✅ Complete | 100% | Mobile and tablet optimization |
| **🧪 Testing** | 🟡 In Progress | 80% | Unit and integration tests |
| **🚀 Deployment** | 🟡 Ready | 90% | Production deployment setup |

### **🔮 Future Enhancements**
- [ ] **Multi-language Support**: i18n internationalization
- [ ] **Advanced Analytics**: Custom dashboard creation
- [ ] **Offline Support**: PWA capabilities with offline data
- [ ] **Push Notifications**: Web push for critical alerts
- [ ] **Data Export**: Advanced export formats (PDF, Excel)
- [ ] **User Management**: Authentication and role-based access

---

## 🤝 **Contributing & Support**

### **👥 Team Members**
- **Arnav Sharma**: Frontend Development & Architecture
- **Radhika Patel**: UI/UX Design & User Experience
- **Suryansh Kumar**: Backend Integration & API
- **Aryan Singh**: AI/ML Integration
- **Neha Gupta**: Data Management & Quality
- **Harshit Malhotra**: IoT Integration

### **📞 Getting Help**
- **📚 Documentation**: Comprehensive guides in each directory
- **🎥 Video Tutorials**: Available in `/frontend/assets/videos/`
- **🐛 Issue Tracking**: GitHub Issues for bug reports
- **💬 Team Communication**: Daily standups and collaboration

### **📄 Related Documentation**
- **[🏠 Main Project README](../README.md)**: Complete system overview
- **[🌐 API Documentation](../api/README.md)**: Backend API reference
- **[🧠 AI Integration](../ai/README_ENHANCED.md)**: AI/ML model details
- **[📱 IoT Guide](../iot/README.md)**: IoT device integration
- **[📊 Data Management](../data/README.md)**: Data pipeline and quality

---

## 📄 **License & Acknowledgments**

### **📜 License**
This project is part of the **SIH 2025 AgriTech Innovators** submission and follows the project's licensing terms.

### **🙏 Acknowledgments**
- **Smart India Hackathon 2025** for the platform and challenge
- **React Community** for the excellent framework and ecosystem
- **Material-UI Team** for the professional component library
- **Open Source Contributors** for all the amazing tools and libraries
- **Agricultural Domain Experts** for guidance and validation

---

**🌾 Built with ❤️ by the AgriTech Innovators Team | SIH 2025 | React Dashboard 🚀**

### Production Build

```bash
npm run build
```

### Environment Variables

Set production environment variables:

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
```

### Deployment Options

- **Vercel**: `npm run build` and deploy `build/` folder
- **Netlify**: Connect Git repository for automatic deployment
- **Docker**: Use provided Dockerfile for containerized deployment
- **Static Hosting**: Deploy `build/` folder to any static host

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify API server is running on port 8000
   - Check CORS configuration in API server
   - Confirm network connectivity

2. **WebSocket Connection Issues**
   - Ensure WebSocket endpoint is accessible
   - Check firewall/proxy settings
   - Verify WebSocket URL format

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies are installed

## 📈 Performance

### Optimization Features

- **React Query Caching**: Efficient data fetching and caching
- **Component Memoization**: Prevents unnecessary re-renders
- **Code Splitting**: Lazy loading for better initial load times
- **Image Optimization**: Optimized assets and lazy loading

### Monitoring

- Web Vitals integration for performance monitoring
- Error boundaries for graceful error handling
- Console logging for development debugging

## 🤝 Contributing

1. **Code Style**: Follow existing TypeScript and React patterns
2. **Component Design**: Create reusable, well-documented components
3. **Type Safety**: Maintain full TypeScript coverage
4. **Testing**: Write tests for new components and functions
5. **Documentation**: Update README and inline comments

## 📄 License

This project is part of the SIH 2025 AgriTech Innovators submission and follows the project's licensing terms.

---

**🌾 Built with ❤️ by the AgriTech Innovators Team**