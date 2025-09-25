import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  EnergySavingsLeaf as EcoIcon,
  Science as ScienceIcon,
  Public as PublicIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
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

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Robotics Officer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b131?w=150&h=150&fit=crop&crop=face",
      bio: "PhD in Robotics Engineering with 15+ years developing autonomous agricultural systems and precision farming robots.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "Marcus Johnson",
      role: "AI & Vision Systems Lead",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Computer vision and machine learning expert specializing in crop recognition and autonomous navigation systems.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "Elena Rodriguez",
      role: "Autonomous Systems Director",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Mechatronics engineer focused on developing sustainable autonomous farming solutions and robotic fleet management.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "David Kim",
      role: "Field Operations Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Former precision farmer turned robotics specialist, bridging traditional farming knowledge with cutting-edge automation.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    }
  ];

  const values = [
    {
      icon: <EcoIcon sx={{ fontSize: 48 }} />,
      title: "Sustainability",
      description: "Our autonomous systems minimize resource waste and environmental impact while maximizing crop yields through precise robotic operations."
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 48 }} />,
      title: "Innovation",
      description: "Cutting-edge robotics, AI vision systems, and machine learning algorithms power our autonomous farming solutions."
    },
    {
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      title: "Autonomy",
      description: "We empower farmers with self-operating agricultural systems that reduce manual labor while increasing operational efficiency."
    },
    {
      icon: <PublicIcon sx={{ fontSize: 48 }} />,
      title: "Global Impact",
      description: "Our robotic farming solutions address global food security challenges through scalable autonomous agriculture technology."
    }
  ];

  const stats = [
    { number: "50K+", label: "Farmers Served", icon: <GroupIcon /> },
    { number: "2.3M", label: "Acres Monitored", icon: <AgricultureIcon /> },
    { number: "35%", label: "Avg. Yield Increase", icon: <TrendingUpIcon /> },
    { number: "15", label: "Countries Active", icon: <PublicIcon /> },
  ];

  return (
    <Box className="fade-in">
      {/* Hero Section with Parallax */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.9), rgba(139, 90, 60, 0.8)), url('https://images.unsplash.com/photo-1574323427835-bb2d3a96e887?w=1600&h=900&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
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
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              AgroBotics Revolution
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                margin: '0 auto',
                fontWeight: 300,
                lineHeight: 1.6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Pioneering the future of autonomous agriculture through intelligent robotics, 
              AI-powered insights, and precision farming automation.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        borderRadius: 4,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Box sx={{ color: 'secondary.main', mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInVariants}
              >
                <Typography variant="h2" gutterBottom>
                  Our Story
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Founded in 2020, AgroBotics emerged from a revolutionary vision: to transform agriculture 
                  through autonomous robotics and artificial intelligence. Our founders, a pioneering team of 
                  robotics engineers, AI specialists, agricultural scientists, and experienced farmers, 
                  recognized the critical need for intelligent automation in modern farming.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  What began as an ambitious robotics research initiative has evolved into a comprehensive 
                  autonomous farming ecosystem that serves progressive farms worldwide. We integrate advanced 
                  robotics, computer vision, machine learning, and IoT technologies to create self-operating 
                  agricultural systems that maximize efficiency while minimizing human intervention.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Today, AgroBotics stands at the forefront of agricultural automation, helping farms achieve 
                  45% higher productivity while reducing labor costs by 60% and environmental impact by 40% 
                  through precision robotic operations.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
                  alt="Modern farming technology"
                  sx={{
                    width: '100%',
                    height: { xs: '250px', md: '400px' },
                    objectFit: 'cover',
                    borderRadius: 4,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
              Our Values
            </Typography>
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          borderColor: 'secondary.main',
                        }
                      }}
                    >
                      <Box sx={{ color: 'secondary.main', mb: 3 }}>
                        {value.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom fontWeight={600}>
                        {value.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {value.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 2 }}>
              Meet Our Team
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 6, maxWidth: '600px', margin: '0 auto 48px' }}
            >
              Our diverse team brings together decades of experience in agriculture, 
              technology, and sustainable practices.
            </Typography>
            
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
                          border: '3px solid',
                          borderColor: 'secondary.main'
                        }}
                      />
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.role}
                        color="secondary"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph 
                        sx={{ lineHeight: 1.6 }}
                      >
                        {member.bio}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'grey.600' }}>
                          <LinkedInIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'grey.600' }}>
                          <TwitterIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'grey.600' }}>
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Mission Statement */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.05), rgba(139, 90, 60, 0.05))`,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariants}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6B7280, #8B5A3C)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Mission
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontStyle: 'italic'
                }}
              >
                "To revolutionize global agriculture through autonomous robotics and AI, creating 
                self-sufficient farming systems that maximize productivity, minimize environmental 
                impact, and ensure food security for future generations."
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;