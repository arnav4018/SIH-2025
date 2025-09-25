import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import { MetricCardProps } from '../types';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  trend,
  status = 'good',
  loading = false,
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          text: theme.palette.success.dark,
          border: theme.palette.success.main,
          accent: theme.palette.success.main,
        };
      case 'good':
        return {
          bg: 'rgba(59, 130, 246, 0.08)',
          text: theme.palette.info.dark,
          border: theme.palette.info.main,
          accent: theme.palette.info.main,
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.08)',
          text: theme.palette.warning.dark,
          border: theme.palette.warning.main,
          accent: theme.palette.warning.main,
        };
      case 'critical':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          text: theme.palette.error.dark,
          border: theme.palette.error.main,
          accent: theme.palette.error.main,
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.08)',
          text: theme.palette.text.primary,
          border: theme.palette.grey[400],
          accent: theme.palette.grey[400],
        };
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'stable':
        return <TrendingFlatIcon sx={{ fontSize: 16, color: 'grey.600' }} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'default';
    
    switch (trend.direction) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      case 'stable':
        return 'default';
      default:
        return 'default';
    }
  };

  const colors = getStatusColor();

  if (loading) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          borderLeft: `4px solid ${colors.border}`,
          '&:hover': {
            boxShadow: theme.shadows[8],
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width={80} height={40} />
          <Skeleton variant="text" width={60} height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: colors.bg,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-4px)',
          borderColor: colors.accent,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          backgroundColor: colors.accent,
          borderRadius: '16px 16px 0 0',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: colors.accent,
                display: 'flex',
                alignItems: 'center',
                '& > *': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="baseline" gap={0.5} mb={2}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1,
              fontSize: '2.5rem'
            }}
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </Typography>
          {unit && (
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 500,
                color: 'text.secondary',
                fontSize: '1rem'
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {trend && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {getTrendIcon()}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: trend.direction === 'up' ? 'success.main' : 
                         trend.direction === 'down' ? 'error.main' : 'text.secondary'
                }}
              >
                {trend.percentage > 0 ? '+' : ''}{trend.percentage.toFixed(1)}%
              </Typography>
            </Box>
          )}

          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              backgroundColor: colors.accent,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 500,
              height: 24,
              borderRadius: 2,
              '& .MuiChip-label': {
                px: 1.5,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;