import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Icon,
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocalShipping as DeliveryIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Schedule as TimeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Types
interface DeliveryStatsProps {
  data: {
    totalDeliveries: number;
    successRate: number;
    averageTime: number;
    failed: number;
    lastUpdated: string;
  };
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Styled components
const StatsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StatItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "positive" && prop !== "negative",
})<{ positive?: boolean; negative?: boolean }>(
  ({ theme, positive, negative }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1.8),
    borderRadius: theme.shape.borderRadius * 1.5,
    background: alpha(
      positive
        ? theme.palette.success.main
        : negative
        ? theme.palette.error.main
        : theme.palette.primary.main,
      0.08
    ),
    marginBottom: theme.spacing(2),
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 3px 10px ${alpha(
      positive
        ? theme.palette.success.main
        : negative
        ? theme.palette.error.main
        : theme.palette.primary.main,
      0.1
    )}`,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: `0 6px 15px ${alpha(
        positive
          ? theme.palette.success.main
          : negative
          ? theme.palette.error.main
          : theme.palette.primary.main,
        0.15
      )}`,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `radial-gradient(circle at top right, ${alpha(
        positive
          ? theme.palette.success.main
          : negative
          ? theme.palette.error.main
          : theme.palette.primary.main,
        0.2
      )}, transparent 70%)`,
      zIndex: 0,
    },
  })
);

const IconBox = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1.5),
  position: "relative",
  zIndex: 1,
}));

// Main component
const DeliveryStatsCard: React.FC<DeliveryStatsProps> = ({
  data,
  loading,
  error,
  onRefresh,
}) => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Format time function
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) {
      return `${mins} min`;
    }

    return `${hours}h ${mins}m`;
  };

  // Render loading state
  if (loading) {
    return (
      <Card
        elevation={3}
        sx={{
          height: "100%",
          borderRadius: theme.shape.borderRadius * 2,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.95
          )}, ${alpha(theme.palette.background.paper, 0.85)})`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ height: "100%", p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              py: 4,
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2">
              Loading delivery statistics...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={3}
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        height: "100%",
        borderRadius: theme.shape.borderRadius * 2,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.paper,
          0.95
        )}, ${alpha(theme.palette.background.paper, 0.85)})`,
        backdropFilter: "blur(10px)",
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            component={motion.h2}
            variants={itemVariants}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={iconVariants}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                  boxShadow: `0 4px 10px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                <DeliveryIcon />
              </Box>
            </motion.div>
            Delivery Statistics
          </Typography>

          <Tooltip title="Refresh data">
            <IconButton
              size="small"
              onClick={onRefresh}
              component={motion.button}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats grid */}
        <StatsGrid
          container
          spacing={2}
          component={motion.div}
          variants={itemVariants}
        >
          {/* Total Deliveries */}
          <Grid item xs={12} sm={6}>
            <motion.div variants={itemVariants}>
              <StatItem>
                <IconBox
                  sx={{
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <DeliveryIcon />
                </IconBox>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Deliveries
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {data.totalDeliveries.toLocaleString()}
                  </Typography>
                </Box>
              </StatItem>
            </motion.div>
          </Grid>

          {/* Success Rate */}
          <Grid item xs={12} sm={6}>
            <motion.div variants={itemVariants}>
              <StatItem positive>
                <IconBox
                  sx={{
                    color: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                  }}
                >
                  <SuccessIcon />
                </IconBox>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Success Rate
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, lineHeight: 1.2 }}
                    >
                      {data.successRate}%
                    </Typography>
                    <Box
                      component={motion.div}
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 1,
                        color:
                          data.successRate >= 90
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                      }}
                    >
                      {data.successRate >= 90 ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : (
                        <TrendingDownIcon fontSize="small" />
                      )}
                    </Box>
                  </Box>
                </Box>
              </StatItem>
            </motion.div>
          </Grid>

          {/* Average Delivery Time */}
          <Grid item xs={12} sm={6}>
            <motion.div variants={itemVariants}>
              <StatItem>
                <IconBox
                  sx={{
                    color: theme.palette.info.main,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                  }}
                >
                  <TimeIcon />
                </IconBox>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Average Delivery Time
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, lineHeight: 1.2 }}
                    >
                      {formatTime(data.averageTime)}
                    </Typography>
                    <Box
                      component={motion.div}
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: 1,
                        color:
                          data.averageTime <= 30
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                      }}
                    >
                      {data.averageTime <= 30 ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : (
                        <TrendingDownIcon fontSize="small" />
                      )}
                    </Box>
                  </Box>
                </Box>
              </StatItem>
            </motion.div>
          </Grid>

          {/* Failed Deliveries */}
          <Grid item xs={12} sm={6}>
            <motion.div variants={itemVariants}>
              <StatItem negative>
                <IconBox
                  sx={{
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  }}
                >
                  <WarningIcon />
                </IconBox>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Failed Deliveries
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {data.failed.toLocaleString()}
                  </Typography>
                </Box>
              </StatItem>
            </motion.div>
          </Grid>
        </StatsGrid>

        {/* Last updated */}
        <Box
          sx={{
            mt: 1,
            textAlign: "right",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pt: 1,
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <Typography variant="caption" color="textSecondary">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeliveryStatsCard;
