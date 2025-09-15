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
          bg: theme.palette.success.light,
          text: theme.palette.success.dark,
          border: theme.palette.success.main,
        };
      case 'good':
        return {
          bg: theme.palette.info.light,
          text: theme.palette.info.dark,
          border: theme.palette.info.main,
        };
      case 'warning':
        return {
          bg: theme.palette.warning.light,
          text: theme.palette.warning.dark,
          border: theme.palette.warning.main,
        };
      case 'critical':
        return {
          bg: theme.palette.error.light,
          text: theme.palette.error.dark,
          border: theme.palette.error.main,
        };
      default:
        return {
          bg: theme.palette.grey[100],
          text: theme.palette.grey[800],
          border: theme.palette.grey[400],
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
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        borderLeft: `4px solid ${colors.border}`,
        backgroundColor: colors.bg,
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: colors.text,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="baseline" gap={1} mb={1}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 700,
              color: colors.text,
              lineHeight: 1,
            }}
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </Typography>
          {unit && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 500 }}
            >
              {unit}
            </Typography>
          )}
        </Box>

        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={getTrendIcon()}
              label={`${trend.percentage > 0 ? '+' : ''}${trend.percentage.toFixed(1)}%`}
              size="small"
              color={getTrendColor() as any}
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>
        )}

        {/* Status indicator */}
        <Box mt={2}>
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              backgroundColor: colors.border,
              color: 'white',
              fontSize: '0.75rem',
              height: 20,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;