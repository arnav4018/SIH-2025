import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon,
  EnergySavingsLeaf as EcoIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
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

  const services = [
    {
      icon: <DashboardIcon sx={{ fontSize: 48 }} />,
      title: "Autonomous Crop Monitoring",
      description: "Deploy intelligent robots that patrol fields 24/7, monitoring crop health and growth patterns.",
      features: ["AI-powered crop recognition", "Disease detection robots", "Real-time health mapping", "Automated alerts"],
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=250&fit=crop"
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: "Robotic Harvesting",
      description: "Advanced harvesting robots with computer vision to identify and pick crops at optimal ripeness.",
      features: ["Precision picking algorithms", "Yield optimization", "Gentle handling systems", "24/7 operation capability"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
    },
    {
      icon: <EcoIcon sx={{ fontSize: 48 }} />,
      title: "Smart Irrigation Bots",
      description: "Autonomous irrigation systems that deliver precise water and nutrients exactly where needed.",
      features: ["Soil moisture sensing", "Precision water delivery", "Nutrient injection systems", "Water conservation algorithms"],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop"
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
      title: "Autonomous Planting",
      description: "Robotic planting systems with GPS precision and optimal seed placement algorithms.",
      features: ["GPS-guided planting", "Variable seeding rates", "Soil preparation robots", "Multi-crop capability"],
      image: "https://images.unsplash.com/photo-1574323427835-bb2d3a96e887?w=400&h=250&fit=crop"
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 48 }} />,
      title: "Robotic Soil Analysis",
      description: "Mobile laboratory robots that perform real-time soil testing and analysis across your fields.",
      features: ["Mobile soil testing", "Real-time nutrient mapping", "pH level monitoring", "Automated recommendations"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop"
    },
    {
      icon: <SupportIcon sx={{ fontSize: 48 }} />,
      title: "Fleet Management",
      description: "Comprehensive management platform for your entire fleet of agricultural robots.",
      features: ["Centralized robot control", "Performance analytics", "Maintenance scheduling", "Remote diagnostics"],
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small farms and hobbyist growers",
      popular: false,
      features: [
        "Up to 10 acres monitoring",
        "Basic sensor package",
        "Mobile app access",
        "Monthly reports",
        "Email support",
        "Cloud data storage"
      ],
      buttonText: "Start Free Trial",
      color: "primary"
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for medium-scale commercial farms",
      popular: true,
      features: [
        "Up to 100 acres monitoring",
        "Advanced sensor suite",
        "AI-powered insights",
        "Weekly reports",
        "Priority phone support",
        "Custom dashboards",
        "Integration support",
        "Training included"
      ],
      buttonText: "Get Started",
      color: "secondary"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale operations and cooperatives",
      popular: false,
      features: [
        "Unlimited acres monitoring",
        "Full sensor ecosystem",
        "Advanced AI & ML models",
        "Real-time reports",
        "Dedicated account manager",
        "Custom integrations",
        "On-site training",
        "SLA guarantee",
        "White-label options"
      ],
      buttonText: "Contact Sales",
      color: "primary"
    }
  ];

  const testimonials = [
    {
      name: "John Martinez",
      role: "Farm Manager, GreenFields Co.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "AgroBotics has revolutionized our 500-acre operation. The autonomous harvesting robots increased our yield by 45% while reducing labor costs by 60%. It's truly the future of farming."
    },
    {
      name: "Sarah Thompson",
      role: "Sustainable Agriculture Pioneer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The precision of AgroBotics' irrigation robots has helped us maintain our organic certification while reducing water usage by 35%. The technology perfectly aligns with our sustainability goals."
    },
    {
      name: "Michael Chen",
      role: "Agricultural Automation Specialist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "I recommend AgroBotics to all progressive farms. The robotic fleet management system is intuitive, the automation is reliable, and their support team understands both farming and robotics."
    }
  ];

  return (
    <Box className="fade-in">
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.9), rgba(139, 90, 60, 0.8)), url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1600&h=600&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 8, md: 12 },
          color: 'white',
          position: 'relative',
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
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: 300,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
Advanced autonomous robotic systems designed to revolutionize your farming operations
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
              What We Offer
            </Typography>
            
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          borderColor: 'secondary.main',
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={service.image}
                        alt={service.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: '16px 16px 0 0'
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ color: 'secondary.main', mb: 2 }}>
                          {service.icon}
                        </Box>
                        <Typography variant="h5" gutterBottom fontWeight={600}>
                          {service.title}
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                          {service.description}
                        </Typography>
                        <List dense sx={{ mt: 2 }}>
                          {service.features.map((feature, featureIndex) => (
                            <ListItem key={featureIndex} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckIcon color="secondary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 2 }}>
              Choose Your Plan
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 6, maxWidth: '600px', margin: '0 auto 48px' }}
            >
              Select the perfect robotic solution for your farm. All plans include our core autonomous 
              systems and can be customized with additional robotic modules as needed.
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {pricingPlans.map((plan, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Card
                      elevation={plan.popular ? 8 : 0}
                      sx={{
                        height: '100%',
                        position: 'relative',
                        borderRadius: 4,
                        border: plan.popular ? 'none' : '1px solid',
                        borderColor: 'grey.200',
                        backgroundColor: plan.popular ? 'secondary.main' : 'white',
                        color: plan.popular ? 'white' : 'text.primary',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: plan.popular 
                            ? '0 25px 50px -12px rgba(139, 90, 60, 0.25)'
                            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      {plan.popular && (
                        <Chip
                          label="Most Popular"
                          color="primary"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom fontWeight={700}>
                          {plan.name}
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="h2"
                            component="span"
                            sx={{ 
                              fontWeight: 700,
                              color: plan.popular ? 'white' : 'primary.main'
                            }}
                          >
                            {plan.price}
                          </Typography>
                          <Typography
                            variant="h6"
                            component="span"
                            sx={{ 
                              fontWeight: 400,
                              color: plan.popular ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                            }}
                          >
                            {plan.period}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          paragraph 
                          sx={{ 
                            color: plan.popular ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                            mb: 4
                          }}
                        >
                          {plan.description}
                        </Typography>

                        <List sx={{ mb: 4 }}>
                          {plan.features.map((feature, featureIndex) => (
                            <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckIcon 
                                  fontSize="small" 
                                  sx={{ 
                                    color: plan.popular ? 'white' : 'secondary.main' 
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  color: plan.popular ? 'rgba(255,255,255,0.9)' : 'text.primary'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        <Button
                          variant={plan.popular ? "outlined" : "contained"}
                          color={plan.popular ? "inherit" : plan.color as any}
                          fullWidth
                          size="large"
                          sx={{
                            py: 1.5,
                            fontWeight: 600,
                            backgroundColor: plan.popular ? 'transparent' : undefined,
                            borderColor: plan.popular ? 'white' : undefined,
                            color: plan.popular ? 'white' : undefined,
                            '&:hover': {
                              backgroundColor: plan.popular ? 'rgba(255,255,255,0.1)' : undefined,
                            }
                          }}
                        >
                          {plan.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
              What Our Clients Say
            </Typography>
            
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        paragraph 
                        sx={{ 
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          mb: 3,
                          '&::before': {
                            content: '"""',
                            fontSize: '2rem',
                            color: 'secondary.main',
                            position: 'absolute',
                            top: 16,
                            left: 16,
                          }
                        }}
                      >
                        {testimonial.quote}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(139, 90, 60, 0.1))`,
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
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Ready to Get Started?
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                color="text.secondary" 
                sx={{ mb: 4, fontSize: '1.1rem' }}
              >
                Join progressive farms worldwide who are already using AgroBotics autonomous systems. 
                Start your robotic transformation today and experience the future of agriculture.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ minWidth: 160 }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<PhoneIcon />}
                  sx={{ minWidth: 160 }}
                >
                  Schedule Demo
                </Button>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2 }}
              >
                No credit card required • 30-day free trial • Cancel anytime
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Services;