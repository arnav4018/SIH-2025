# AgriTech React Dashboard

Modern React-based agricultural monitoring dashboard for the SIH 2025 AgriTech Innovators project.

## 🚀 Features

- **Real-time Monitoring**: Live sensor data updates via WebSocket
- **Interactive Dashboard**: Comprehensive view of environmental conditions
- **AI Integration**: Display of analysis results from MATLAB backend
- **Responsive Design**: Works on desktop and mobile devices
- **Material-UI Components**: Professional and consistent UI
- **Data Visualization**: Charts and graphs using Recharts
- **Alert System**: Real-time notifications for critical events
- **TypeScript**: Full type safety and better development experience

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional React components
- **React Query (@tanstack/react-query)** - Server state management
- **Recharts** - Data visualization library
- **Axios** - HTTP client for API communication
- **Socket.io Client** - Real-time WebSocket communication
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful toast notifications

## 📁 Project Structure

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

## 📊 Dashboard Features

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

## 🔗 API Endpoints

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

## 🚀 Deployment

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