import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  Sensors as SensorsIcon,
  Memory as ProcessorIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Storage as DatabaseIcon,
  Satellite as SatelliteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutWrapped: React.FC = () => {

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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      color: "#4CAF50"
    },
    {
      name: "Radhika Aggrawal",
      role: "UI/UX Designer & Presentation Specialist",
      team: "Frontend",
      responsibilities: ["User Experience Design", "Interface Design", "Presentation Materials", "Brand Identity"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      color: "#E91E63"
    },
    {
      name: "Suryansh Singh",
      role: "Backend Developer & System Architect",
      team: "Backend",
      responsibilities: ["MATLAB Integration", "System Orchestration", "API Development", "Performance Optimization"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      color: "#2196F3"
    },
    {
      name: "Aryan Nayak",
      role: "AI/ML Engineer & Data Engineer",
      team: "AI/ML & Data",
      responsibilities: ["Predictive Analytics", "Alert Intelligence", "Data Pipeline", "Feature Engineering"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
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

  // Workflow steps
  const workflowSteps = [
    { icon: <SensorsIcon />, title: "Field Sensors", description: "IoT sensors collect real-time data", color: "#90EE90" },
    { icon: <CloudIcon />, title: "MQTT Broker", description: "Data transmission hub", color: "#87CEEB" },
    { icon: <ProcessorIcon />, title: "Data Processing", description: "FastAPI server processes data", color: "#FFB6C1" },
    { icon: <AnalyticsIcon />, title: "AI/ML Analysis", description: "MATLAB & AI models analyze", color: "#DDA0DD" },
    { icon: <SatelliteIcon />, title: "Hyperspectral Imaging", description: "Advanced crop monitoring", color: "#87CEEB" },
    { icon: <DatabaseIcon />, title: "Historical Database", description: "Data storage & retrieval", color: "#90EE90" },
    { icon: <DashboardIcon />, title: "React Dashboard", description: "User interface & visualization", color: "#FFB6C1" },
    { icon: <PeopleIcon />, title: "Farmers & Experts", description: "Actionable insights delivery", color: "#DDA0DD" }
  ];

  return (
    <Box className="fade-in" sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
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
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Empowering Farmers with AI
            </Typography>
            
            <Typography
              variant="h5"
              align="center"
              sx={{
                maxWidth: '800px',
                margin: '0 auto',
                fontWeight: 300,
                lineHeight: 1.6,
                mb: 4,
                opacity: 0.9,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              The future of farming faces a critical challenge: how to protect crops from increasing threats like soil degradation, pests, and volatile weather. The old ways of monitoring are no longer enough.
            </Typography>

            <Typography
              variant="h6"
              align="center"
              sx={{
                maxWidth: '900px',
                margin: '0 auto',
                fontWeight: 300,
                lineHeight: 1.7,
                opacity: 0.8,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              We are building the solution: a unified, AI-driven software platform to bring precision and foresight to agriculture. Our system harnesses the power of multispectral and hyperspectral imaging to see what the human eye cannot. By combining this with environmental sensor data, we provide a complete, real-time analysis of the farm.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Features/Workflow Section */}
      <Box sx={{ py: 10, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                Features
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: '#666' }}>
                Application Workflow for Judges
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, color: '#888' }}>
                Complete System Flow Overview
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '800px', margin: '0 auto', color: '#555', lineHeight: 1.6 }}>
                Our Smart Agriculture Monitoring System follows a comprehensive data flow from field sensors to actionable farmer insights. Here's the complete workflow that judges can observe and evaluate:
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {workflowSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        backgroundColor: step.color,
                        borderRadius: 4,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid transparent',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          border: '2px solid rgba(76, 175, 80, 0.3)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          '& svg': { fontSize: '2rem', color: '#333' }
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5 }}>
                        {step.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Workflow Connections */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Paper elevation={0} sx={{ p: 4, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                  Data Flow Process
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  🌱 Field Sensors → 📶 MQTT Broker → 🔄 Data Forwarder → 🌐 FastAPI Server → 🧮 MATLAB Engine → 🧠 AI/ML Models → ⚛️ React Dashboard → 👨‍🌾 Farmers & Experts
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: '#888', fontStyle: 'italic' }}>
                  With parallel inputs from 🛰️ Hyperspectral Images and 📊 Historical Database
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 10, backgroundColor: '#fafafa' }}>
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

            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        height: '100%',
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          border: `2px solid ${member.color}`
                        }
                      }}
                    >
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{
                          width: 100,
                          height: 100,
                          margin: '0 auto 16px',
                          border: `4px solid ${member.color}`
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>

                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                        {member.name}
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: member.color }}>
                        {member.role}
                      </Typography>

                      <Chip 
                        label={member.team} 
                        size="small" 
                        sx={{ 
                          mb: 2, 
                          backgroundColor: member.color, 
                          color: 'white',
                          fontWeight: 600 
                        }} 
                      />

                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
                          Key Responsibilities:
                        </Typography>
                        {member.responsibilities.map((resp, idx) => (
                          <Typography 
                            key={idx} 
                            variant="body2" 
                            sx={{ color: '#777', mb: 0.5, fontSize: '0.85rem' }}
                          >
                            • {resp}
                          </Typography>
                        ))}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 10, backgroundColor: 'white' }}>
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
    </Box>
  );
};

export default AboutWrapped;