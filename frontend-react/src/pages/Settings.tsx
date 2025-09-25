import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Tabs,
  Tab,
  Slider,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccountBox as AccountIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  CloudSync as CloudSyncIcon,
  Edit as EditIcon,
  Camera as CameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Smartphone as SmartphoneIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  VpnKey as VpnKeyIcon,
  Fingerprint as FingerprintIcon,
  Shield as ShieldIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@agrobotics.com',
    phone: '+1 (555) 123-4567',
    company: 'Automated Farming Co.',
    location: 'California, USA',
    timezone: 'America/Los_Angeles',
    language: 'en',
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    weatherAlerts: true,
    systemMaintenance: true,
    marketingEmails: false,
    weeklyReports: true,
    alertThreshold: 75,
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    dataEncryption: true,
  });

  // App settings state
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    dataSync: 'auto',
    cacheSize: 500,
    offlineMode: true,
    autoBackup: true,
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = () => {
    setIsEditing(false);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean | number) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppSettingsChange = (field: string, value: any) => {
    setAppSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box className="fade-in">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account, notifications, security, and application preferences
            </Typography>
          </Box>

          {/* Save Success Alert */}
          {showSaveAlert && (
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
              onClose={() => setShowSaveAlert(false)}
            >
              Settings saved successfully!
            </Alert>
          )}

          {/* Settings Tabs */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }
              }}
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<ThemeIcon />} label="Preferences" />
            </Tabs>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            width: 100, 
                            height: 100,
                            fontSize: '2rem',
                            backgroundColor: 'secondary.main'
                          }}
                        >
                          {profileData.firstName[0]}{profileData.lastName[0]}
                        </Avatar>
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'background.paper',
                            border: '2px solid',
                            borderColor: 'grey.300',
                            '&:hover': {
                              backgroundColor: 'grey.50'
                            }
                          }}
                        >
                          <CameraIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {profileData.firstName} {profileData.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profileData.company}
                      </Typography>
                      <Chip 
                        label="Premium Account" 
                        color="secondary" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Personal Information</Typography>
                        {!isEditing ? (
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(true)}
                            color="primary"
                          >
                            Edit
                          </Button>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              startIcon={<SaveIcon />}
                              variant="contained"
                              color="secondary"
                              onClick={handleSaveSettings}
                            >
                              Save
                            </Button>
                            <Button
                              startIcon={<CancelIcon />}
                              variant="outlined"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            value={profileData.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone"
                            value={profileData.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Company"
                            value={profileData.company}
                            onChange={(e) => handleProfileChange('company', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Location"
                            value={profileData.location}
                            onChange={(e) => handleProfileChange('location', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!isEditing}>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                              value={profileData.timezone}
                              onChange={(e) => handleProfileChange('timezone', e.target.value)}
                            >
                              <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                              <MenuItem value="America/New_York">Eastern Time</MenuItem>
                              <MenuItem value="America/Chicago">Central Time</MenuItem>
                              <MenuItem value="America/Denver">Mountain Time</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={!isEditing}>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={profileData.language}
                              onChange={(e) => handleProfileChange('language', e.target.value)}
                            >
                              <MenuItem value="en">English</MenuItem>
                              <MenuItem value="es">Spanish</MenuItem>
                              <MenuItem value="fr">French</MenuItem>
                              <MenuItem value="de">German</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Alert Preferences
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary="Email Alerts" secondary="Receive alerts via email" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.emailAlerts}
                              onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <SmartphoneIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary="Push Notifications" secondary="Mobile app notifications" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.pushNotifications}
                              onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <SmsIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary="SMS Alerts" secondary="Text message notifications" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.smsAlerts}
                              onChange={(e) => handleNotificationChange('smsAlerts', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Content Preferences
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="Weather Alerts" secondary="Severe weather notifications" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.weatherAlerts}
                              onChange={(e) => handleNotificationChange('weatherAlerts', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="System Maintenance" secondary="Scheduled maintenance updates" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.systemMaintenance}
                              onChange={(e) => handleNotificationChange('systemMaintenance', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Weekly Reports" secondary="Automated weekly summaries" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.weeklyReports}
                              onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Marketing Emails" secondary="Product updates and promotions" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={notificationSettings.marketingEmails}
                              onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Alert Threshold ({notificationSettings.alertThreshold}%)
                        </Typography>
                        <Slider
                          value={notificationSettings.alertThreshold}
                          onChange={(_, value) => handleNotificationChange('alertThreshold', value as number)}
                          min={0}
                          max={100}
                          step={5}
                          color="secondary"
                          marks={[
                            { value: 0, label: '0%' },
                            { value: 50, label: '50%' },
                            { value: 100, label: '100%' },
                          ]}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Receive alerts when sensors exceed this threshold
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Authentication
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <VpnKeyIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Two-Factor Authentication" 
                            secondary="Add extra security to your account"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={securitySettings.twoFactorAuth}
                              onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <FingerprintIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Biometric Authentication" 
                            secondary="Use fingerprint or face ID"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={securitySettings.biometricAuth}
                              onChange={(e) => handleSecurityChange('biometricAuth', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon>
                            <ShieldIcon color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Login Alerts" 
                            secondary="Get notified of suspicious login attempts"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={securitySettings.loginAlerts}
                              onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Session Timeout ({securitySettings.sessionTimeout} minutes)
                        </Typography>
                        <Slider
                          value={securitySettings.sessionTimeout}
                          onChange={(_, value) => handleSecurityChange('sessionTimeout', value as number)}
                          min={15}
                          max={120}
                          step={15}
                          color="secondary"
                          marks={[
                            { value: 15, label: '15m' },
                            { value: 60, label: '1h' },
                            { value: 120, label: '2h' },
                          ]}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Account Security
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Change Password
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Download Backup Codes
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          View Login History
                        </Button>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="h6" gutterBottom color="error">
                        Danger Zone
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                      >
                        Delete Account
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        This action cannot be undone
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        App Preferences
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="Dark Mode" secondary="Switch to dark theme" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={appSettings.darkMode}
                              onChange={(e) => handleAppSettingsChange('darkMode', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Offline Mode" secondary="Allow app to work offline" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={appSettings.offlineMode}
                              onChange={(e) => handleAppSettingsChange('offlineMode', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText primary="Auto Backup" secondary="Automatically backup data" />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={appSettings.autoBackup}
                              onChange={(e) => handleAppSettingsChange('autoBackup', e.target.checked)}
                              color="secondary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>

                      <Box sx={{ mt: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Data Sync</InputLabel>
                          <Select
                            value={appSettings.dataSync}
                            onChange={(e) => handleAppSettingsChange('dataSync', e.target.value)}
                          >
                            <MenuItem value="auto">Automatic</MenuItem>
                            <MenuItem value="manual">Manual Only</MenuItem>
                            <MenuItem value="wifi">WiFi Only</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Storage & Performance
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Cache Size ({appSettings.cacheSize} MB)
                        </Typography>
                        <Slider
                          value={appSettings.cacheSize}
                          onChange={(_, value) => handleAppSettingsChange('cacheSize', value as number)}
                          min={100}
                          max={1000}
                          step={50}
                          color="secondary"
                          marks={[
                            { value: 100, label: '100MB' },
                            { value: 500, label: '500MB' },
                            { value: 1000, label: '1GB' },
                          ]}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button variant="outlined" color="primary" fullWidth>
                          Clear Cache
                        </Button>
                        <Button variant="outlined" color="primary" fullWidth>
                          Export Data
                        </Button>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Current storage usage: 234 MB
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Settings;