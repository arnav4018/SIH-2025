import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Chip,
  Drawer,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  Sensors as SensorsIcon,
  Memory as ProcessorIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Storage as DatabaseIcon,
  Satellite as SatelliteIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutNew: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  };

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      
      // Update active section based on scroll position
      if (window.scrollY < 200) {
        setActiveSection('home');
      } else {
        const sections = ['about', 'features', 'team', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Team member data
  const teamMembers = [
    {
      name: "Arnav Manwatkar",
      role: "Frontend Developer & AI/ML Engineer",
      team: "Frontend & AI/ML",
      responsibilities: ["Dashboard Development", "Data Visualization", "Computer Vision", "Deep Learning"],
      avatar: "/images/Arnav.jpg",
      color: "#4CAF50"
    },
    {
      name: "Radhika Aggrawal",
      role: "UI/UX Designer & Presentation Specialist",
      team: "Frontend",
      responsibilities: ["User Experience Design", "Interface Design", "Presentation Materials", "Brand Identity"],
      avatar: "/images/Radhika.jpg",
      color: "#E91E63"
    },
    {
      name: "Suryansh Singh",
      role: "Backend Developer & System Architect",
      team: "Backend",
      responsibilities: ["MATLAB Integration", "System Orchestration", "API Development", "Performance Optimization"],
      avatar: "/images/Suryansh.jpg",
      color: "#2196F3"
    },
    {
      name: "Aryan Nayak",
      role: "AI/ML Engineer & Data Engineer",
      team: "AI/ML & Data",
      responsibilities: ["Predictive Analytics", "Alert Intelligence", "Data Pipeline", "Feature Engineering"],
      avatar: "/images/Aryan.jpg",
      color: "#FF9800"
    },
    {
      name: "Harshit",
      role: "IoT Engineer",
      team: "IoT",
      responsibilities: ["Sensor Networks", "MQTT Communication", "Hardware Integration", "Power Management"],
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      color: "#9C27B0"
    }
  ];

  // Enhanced feature components
  const systemFeatures = [
    { 
      icon: <SensorsIcon />, 
      title: "Smart Field Sensors", 
      description: "Multi-parameter IoT sensors monitor soil moisture, temperature, pH, and nutrient levels in real-time",
      color: "#4CAF50",
      bgColor: "#e8f5e8",
      features: ["Soil Analysis", "Weather Monitoring", "Crop Health"]
    },
    { 
      icon: <CloudIcon />, 
      title: "Cloud Communication", 
      description: "Secure MQTT protocol ensures reliable data transmission from field to processing centers",
      color: "#2196F3",
      bgColor: "#e3f2fd",
      features: ["Real-time Data", "Secure Protocol", "Edge Computing"]
    },
    { 
      icon: <ProcessorIcon />, 
      title: "Data Processing Engine", 
      description: "High-performance FastAPI servers handle massive data streams with intelligent filtering",
      color: "#FF5722",
      bgColor: "#fbe9e7",
      features: ["Fast Processing", "Data Validation", "Stream Analytics"]
    },
    { 
      icon: <AnalyticsIcon />, 
      title: "AI-Powered Analytics", 
      description: "Advanced machine learning models and MATLAB integration provide predictive insights",
      color: "#9C27B0",
      bgColor: "#f3e5f5",
      features: ["Predictive Models", "Pattern Recognition", "Risk Assessment"]
    },
    { 
      icon: <SatelliteIcon />, 
      title: "Satellite Imaging", 
      description: "Hyperspectral and multispectral satellite data reveals crop health invisible to the human eye",
      color: "#00BCD4",
      bgColor: "#e0f2f1",
      features: ["Crop Monitoring", "Disease Detection", "Yield Prediction"]
    },
    { 
      icon: <DatabaseIcon />, 
      title: "Historical Intelligence", 
      description: "Comprehensive database stores years of agricultural data for trend analysis and forecasting",
      color: "#795548",
      bgColor: "#efebe9",
      features: ["Data Storage", "Trend Analysis", "Historical Patterns"]
    },
    { 
      icon: <DashboardIcon />, 
      title: "Interactive Dashboard", 
      description: "Intuitive React-based interface provides real-time visualization and control capabilities",
      color: "#FF9800",
      bgColor: "#fff3e0",
      features: ["Real-time Viz", "Custom Reports", "Mobile Ready"]
    },
    { 
      icon: <PeopleIcon />, 
      title: "Expert Network", 
      description: "Connect farmers with agricultural experts and agronomists for personalized guidance",
      color: "#E91E63",
      bgColor: "#fce4ec",
      features: ["Expert Consultation", "Community Support", "Knowledge Sharing"]
    }
  ];

  const navigationLinks = [
    { id: 'home', label: 'Home', action: 'scroll' },
    { id: 'about', label: 'About', action: 'scroll' },
    { id: 'features', label: 'Features', action: 'scroll' },
    { id: 'team', label: 'Team', action: 'scroll' },
    { id: 'contact', label: 'Contact Us', action: 'scroll' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Minimalist Navigation Bar */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            minHeight: '48px'
          }}>
            {/* Logo/Brand */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={scrollToTop}
            >
              <AgricultureIcon sx={{ 
                color: '#2E7D32', 
                mr: 1.5, 
                fontSize: '1.75rem' 
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1a1a1a', 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                AgroBotics
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {navigationLinks.map((link) => (
                  <Button
                    key={link.id}
                    onClick={() => link.id === 'home' ? scrollToTop() : scrollToSection(link.id)}
                    sx={{
                      color: (activeSection === link.id || (link.id === 'home' && window.scrollY < 100)) ? '#2E7D32' : '#666',
                      fontSize: '0.9rem',
                      fontWeight: (activeSection === link.id || (link.id === 'home' && window.scrollY < 100)) ? 500 : 400,
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      minWidth: 'auto',
                      fontFamily: '"Inter", sans-serif',
                      position: 'relative',
                      '&:hover': {
                        color: '#2E7D32',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: (activeSection === link.id || (link.id === 'home' && window.scrollY < 100)) ? '20px' : '0',
                        height: '2px',
                        backgroundColor: '#2E7D32',
                        borderRadius: '1px',
                        transition: 'width 0.3s ease'
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                
                {/* Dashboard Button */}
                <Button
                  variant="contained"
                  onClick={() => window.location.href = '/dashboard'}
                  sx={{
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 3,
                    py: 1.25,
                    ml: 2,
                    borderRadius: 2,
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                    '&:hover': {
                      backgroundColor: '#1B5E20',
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Access Dashboard
                </Button>
              </Box>
            ) : (
              /* Mobile Menu Button */
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: '#333',
                  p: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: '#fff',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 2, py: 1 }}>
          {navigationLinks.map((link) => (
            <ListItem key={link.id} sx={{ px: 0, py: 0.5 }}>
              <Button
                fullWidth
                onClick={() => link.id === 'home' ? scrollToTop() : scrollToSection(link.id)}
                sx={{
                  justifyContent: 'flex-start',
                  color: (activeSection === link.id || (link.id === 'home' && window.scrollY < 100)) ? '#2E7D32' : '#666',
                  fontWeight: (activeSection === link.id || (link.id === 'home' && window.scrollY < 100)) ? 500 : 400,
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                    color: '#2E7D32'
                  }
                }}
              >
                {link.label}
              </Button>
            </ListItem>
          ))}
          <ListItem sx={{ px: 0, pt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => window.location.href = '/dashboard'}
              sx={{
                backgroundColor: '#2E7D32',
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#1B5E20'
                }
              }}
            >
              Access Dashboard
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <Box 
        id="hero" 
        sx={{ 
          pt: 16, 
          pb: 8, 
          background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <Typography
              variant="h1"
              align="center"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: '3rem', md: '5rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
              }}
            >
              Smart Farming,
              <br />
              Smarter Future
            </Typography>
            
            <Typography
              variant="h4"
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '700px',
                margin: '0 auto 3rem',
                fontWeight: 400,
                lineHeight: 1.5,
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
              }}
            >
              Revolutionizing agriculture with AI-powered precision monitoring and predictive analytics.
            </Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => scrollToSection('about')}
                sx={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  py: 2,
                  mr: 2,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    backgroundColor: '#45a049',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(76, 175, 80, 0.5)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.location.href = '/dashboard'}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                View Dashboard
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 10, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: '#333',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  Empowering Farmers with AI
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#666',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    mb: 3
                  }}
                >
                  The future of farming faces a critical challenge: how to protect crops from increasing threats like soil degradation, pests, and volatile weather. The old ways of monitoring are no longer enough.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#777',
                    fontWeight: 400,
                    lineHeight: 1.8,
                    mb: 4
                  }}
                >
                  We are building the solution: a unified, AI-driven software platform to bring precision and foresight to agriculture. Our system harnesses the power of multispectral and hyperspectral imaging to see what the human eye cannot. By combining this with environmental sensor data, we provide a complete, real-time analysis of the farm.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => scrollToSection('features')}
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#45a049',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Explore Features
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Modern agriculture technology"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Features/Workflow Section */}
      <Box id="features" sx={{ py: 10, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
                System Features
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 500, mb: 3, color: '#4CAF50' }}>
                Comprehensive Agricultural Monitoring
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, color: '#666' }}>
                From Data Collection to Actionable Insights
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '900px', margin: '0 auto', color: '#555', lineHeight: 1.8, fontSize: '1.1rem' }}>
                Our AgroBotics platform integrates cutting-edge IoT sensors, advanced AI analytics, and intuitive visualization 
                to deliver real-time agricultural intelligence. Experience seamless data flow from field to dashboard, 
                empowering farmers with precise, actionable insights for optimal crop management.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {systemFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: 'left',
                        height: '100%',
                        backgroundColor: feature.bgColor,
                        borderRadius: 4,
                        border: `2px solid ${feature.color}30`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: `0 20px 40px ${feature.color}20`,
                          border: `2px solid ${feature.color}`,
                          backgroundColor: 'white'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: 3,
                          backgroundColor: feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          boxShadow: `0 8px 20px ${feature.color}30`,
                          '& svg': { fontSize: '2.2rem', color: 'white' }
                        }}
                      >
                        {feature.icon}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#333', fontSize: '1.1rem' }}>
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, mb: 3 }}>
                        {feature.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {feature.features.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: `${feature.color}15`,
                              color: feature.color,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: '24px',
                              borderRadius: '12px'
                            }}
                          />
                        ))}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Enhanced Data Flow Visualization */}
            <Box sx={{ mt: 8, mb: 6 }}>
              <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, fontWeight: 600, color: '#333' }}>
                Intelligent Data Pipeline
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: '#e8f5e8', borderRadius: 3, textAlign: 'center', border: '2px solid #4CAF50' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', fontWeight: 700 }}>
                      🌱 Data Collection
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      IoT sensors, hyperspectral imaging, and environmental monitoring systems gather comprehensive field data in real-time.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: '#e3f2fd', borderRadius: 3, textAlign: 'center', border: '2px solid #2196F3' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontWeight: 700 }}>
                      🧠 AI Processing
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      Advanced machine learning models and MATLAB analytics process data to identify patterns, threats, and opportunities.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: '#fff3e0', borderRadius: 3, textAlign: 'center', border: '2px solid #FF9800' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#F57C00', fontWeight: 700 }}>
                      📊 Smart Insights
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      Actionable recommendations and predictive alerts delivered through an intuitive dashboard interface.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Technical Flow Diagram */}
              <Paper elevation={0} sx={{ p: 4, backgroundColor: '#f8f9fa', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                  System Architecture Flow
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, textAlign: 'center', fontSize: '0.95rem' }}>
                  <strong>Field Sensors</strong> → <strong>MQTT Broker</strong> → <strong>FastAPI Server</strong> → <strong>MATLAB Engine</strong> → <strong>AI/ML Models</strong> → <strong>React Dashboard</strong> → <strong>Agricultural Insights</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 3, color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
                  Enhanced with parallel processing from hyperspectral satellite imagery and historical agricultural databases
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Team Section */}
      <Box id="team" sx={{ py: 10, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: 700, mb: 8, color: '#333' }}
            >
              Our Team
            </Typography>

            <Grid container spacing={6} justifyContent="center">
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                        }
                      }}
                    >
                      {/* Avatar with subtle background */}
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                          mb: 3
                        }}
                      >
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${member.color}15, ${member.color}08)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: -2,
                              left: -2,
                              right: -2,
                              bottom: -2,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${member.color}, ${member.color}80)`,
                              zIndex: -1,
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            },
                            '&:hover::after': {
                              opacity: 1
                            }
                          }}
                        >
                          <Avatar
                            src={member.avatar}
                            alt={member.name}
                            sx={{
                              width: 110,
                              height: 110,
                              border: '3px solid white',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                            onError={(e) => {
                              console.log(`Failed to load image: ${member.avatar}`);
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = '';
                            }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Box>
                      </Box>

                      {/* Member Info */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1, 
                          color: '#2c3e50',
                          fontSize: '1.1rem'
                        }}
                      >
                        {member.name}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500, 
                          mb: 2, 
                          color: member.color,
                          fontSize: '0.95rem'
                        }}
                      >
                        {member.role}
                      </Typography>

                      {/* Team Badge */}
                      <Box sx={{ mb: 3 }}>
                        <Chip 
                          label={member.team} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${member.color}12`,
                            color: member.color,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: '28px',
                            borderRadius: '14px',
                            border: `1px solid ${member.color}30`
                          }} 
                        />
                      </Box>

                      {/* Skills Tags - Minimal */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {member.responsibilities.slice(0, 2).map((skill, idx) => (
                          <Typography 
                            key={idx} 
                            variant="caption"
                            sx={{ 
                              color: '#666',
                              backgroundColor: '#f8f9fa',
                              px: 2,
                              py: 0.5,
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              border: '1px solid #e9ecef'
                            }}
                          >
                            {skill}
                          </Typography>
                        ))}
                        {member.responsibilities.length > 2 && (
                          <Typography 
                            variant="caption"
                            sx={{ 
                              color: '#888',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          >
                            +{member.responsibilities.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 10, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: 700, mb: 8, color: '#333' }}
            >
              Contact Us
            </Typography>

            <Box sx={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 6, 
                  borderRadius: 4, 
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
                  Ready to transform your agricultural operations? Get in touch with our team!
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#4CAF50' }} />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#333', 
                        fontWeight: 500,
                        '&:hover': { color: '#4CAF50', cursor: 'pointer' }
                      }}
                      onClick={() => window.location.href = 'mailto:arnav@bistbpl.in'}
                    >
                      arnav@bistbpl.in
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#4CAF50' }} />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#333', 
                        fontWeight: 500,
                        '&:hover': { color: '#4CAF50', cursor: 'pointer' }
                      }}
                      onClick={() => window.location.href = 'mailto:suryanshsinghh20@gmail.com'}
                    >
                      suryanshsinghh20@gmail.com
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mt: 4, color: '#888', fontStyle: 'italic' }}>
                  We're here to help you harness the power of AI for smarter agriculture
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: '#333', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            © 2025 AgroBotics Platform. Empowering farmers with AI-driven insights.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutNew;