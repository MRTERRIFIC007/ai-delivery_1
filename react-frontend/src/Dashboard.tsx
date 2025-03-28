import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Container,
  alpha,
  styled,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Thermostat as ThermostatIcon,
  DirectionsCar as DirectionsCarIcon,
  Celebration as CelebrationIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Dashboard as DashboardIcon,
  Brightness7 as SunIcon,
  Bolt as LightningIcon,
  LocalShipping as DeliveryIcon,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

// Components
import WeatherCard from "../components/dashboard/WeatherCard";
import TrafficCard from "../components/dashboard/TrafficCard";
import FestivalCard from "../components/dashboard/FestivalCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";

// Store
import useStore, { DashboardData } from "../store/useStore";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler
);

// Styled components for enhanced visuals
const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "40%",
    height: "100%",
    background: `radial-gradient(circle at top right, ${alpha(
      theme.palette.primary.light,
      0.1
    )}, transparent 70%)`,
    zIndex: -1,
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "30%",
    height: "60%",
    background: `radial-gradient(circle at bottom left, ${alpha(
      theme.palette.secondary.light,
      0.05
    )}, transparent 70%)`,
    zIndex: -1,
    pointerEvents: "none",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
  backdropFilter: "blur(8px)",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 15px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "bgcolor",
})<{ color?: string; bgcolor?: string }>(({ theme, color, bgcolor }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  height: "100%",
  background: bgcolor || alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease-in-out",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const ChartContainer = styled(StyledPaper)(({ theme }) => ({
  "& canvas": {
    filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  position: "relative",
  marginBottom: theme.spacing(2),
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -4,
    left: 0,
    width: "40%",
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    borderRadius: 10,
  },
}));

const TipsContainer = styled(StyledPaper)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.warning.main}`,
  "& ul": {
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(1, 0),
  },
  "& li": {
    marginBottom: theme.spacing(1),
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      left: -16,
      top: "50%",
      transform: "translateY(-50%)",
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const ActivityCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "bgcolor",
})<{ bgcolor?: string }>(({ theme, bgcolor }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  background: bgcolor || theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease-in-out",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.05)}`,
  "&:hover": {
    boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const MotionBox = styled(motion.div)({
  width: "100%",
});

const ActivityIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgcolor",
})<{ bgcolor?: string }>(({ theme, bgcolor }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor || alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

interface ActivityItemProps {
  activity: {
    action: string;
    time: string;
    details: string;
  };
  index: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get data from store
  const {
    realTimeData,
    loadingRealTimeData,
    realTimeError,
    lastUpdated,
    fetchRealTimeData,
    dashboardData,
    loadingDashboard,
    dashboardError,
    fetchDashboardData,
  } = useStore();

  // Combined loading state
  const isLoading = loadingRealTimeData || loadingDashboard;

  useEffect(() => {
    // Fetch real-time data when component mounts
    fetchRealTimeData();
    fetchDashboardData();

    // Set up timer to refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 5 * 60 * 1000);

    // Clean up timer on unmount
    return () => clearInterval(interval);
  }, [fetchRealTimeData, fetchDashboardData]);

  // Helper function to refresh all data
  const handleRefresh = () => {
    fetchRealTimeData();
    fetchDashboardData();
  };

  // Main data summary
  const totalDeliveries = dashboardData?.total_deliveries || 0;
  const successRate = dashboardData?.delivery_success_rate || 0;
  const averageDelay = dashboardData?.average_delivery_time || "0 min";
  const failedDeliveries = dashboardData?.failed_deliveries || 0;

  // Stats for display
  const stats = [
    {
      title: "Total Deliveries",
      value: totalDeliveries,
      color: theme.palette.primary.main,
      icon: <DeliveryIcon />,
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      color: theme.palette.success.main,
      icon: <CheckIcon />,
    },
    {
      title: "Average Time",
      value: averageDelay,
      color: theme.palette.info.main,
      icon: <AccessTimeIcon />,
    },
    {
      title: "Failed Deliveries",
      value: failedDeliveries,
      color: theme.palette.error.main,
      icon: <CloseIcon />,
    },
  ];

  // Helper function to extract pie chart data
  const getPieChartData = (data: DashboardData | null) => {
    if (!data || !data.failure_by_reason) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [100],
            backgroundColor: ["#e0e0e0"],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: Object.keys(data.failure_by_reason),
      datasets: [
        {
          data: Object.values(data.failure_by_reason),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          hoverBorderColor: "#ffffff",
          hoverBorderWidth: 2,
        },
      ],
    };
  };

  // Line chart data for delivery success over time
  const successRateData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Success Rate (%)",
        data: [85, 87, 89, 92, 86, 90, 88],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        tension: 0.4,
        fill: true,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Bar chart data for deliveries by area
  const deliveriesByAreaData = {
    labels: Object.keys(dashboardData?.delivery_by_area || {}),
    datasets: [
      {
        label: "Deliveries",
        data: Object.values(dashboardData?.delivery_by_area || {}),
        backgroundColor: alpha(theme.palette.info.main, 0.7),
        borderColor: theme.palette.info.main,
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: theme.palette.info.main,
      },
    ],
  };

  // Pie chart data for failure reasons
  const failureReasonsData = getPieChartData(dashboardData);

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold" as const,
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        titleColor: theme.palette.text.primary,
        titleFont: {
          size: 14,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          size: 12,
          weight: "normal" as const,
          family: theme.typography.fontFamily,
        },
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          // Add any custom tooltip callbacks here
        },
      },
      title: {
        display: false,
        text: "Delivery Trends",
        font: {
          size: 16,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold" as const,
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        titleColor: theme.palette.text.primary,
        titleFont: {
          size: 14,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          size: 12,
          weight: "normal" as const,
          family: theme.typography.fontFamily,
        },
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
      title: {
        display: false,
        text: "Delivery by Area",
        font: {
          size: 16,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        align: "center" as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
            weight: "bold" as const,
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        titleColor: theme.palette.text.primary,
        titleFont: {
          size: 14,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
        bodyColor: theme.palette.text.secondary,
        bodyFont: {
          size: 12,
          weight: "normal" as const,
          family: theme.typography.fontFamily,
        },
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
      title: {
        display: false,
        text: "Success Rate",
        font: {
          size: 16,
          weight: "bold" as const,
          family: theme.typography.fontFamily,
        },
      },
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const cardHoverEffects = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, type: "tween", ease: "easeOut" },
    },
  };

  return (
    <PageContainer maxWidth="xl">
      {/* Header with refresh button */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader
          totalDeliveries={totalDeliveries}
          deliverySuccessRate={successRate}
          avgDeliveryTime={averageDelay}
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
        />
      </MotionBox>

      {/* Error messages if any */}
      {(dashboardError || realTimeError) && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: `0 8px 25px ${alpha(theme.palette.error.main, 0.15)}`,
            }}
          >
            {dashboardError || realTimeError}
          </Alert>
        </MotionBox>
      )}

      {/* Real-time data cards */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ mb: 4 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MotionBox variants={itemVariants}>
              <WeatherCard
                data={realTimeData?.weather}
                loading={loadingRealTimeData}
                error={realTimeError}
              />
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionBox variants={itemVariants}>
              <TrafficCard
                data={realTimeData?.traffic}
                loading={loadingRealTimeData}
                error={realTimeError}
              />
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionBox variants={itemVariants}>
              <FestivalCard
                data={realTimeData?.festivals}
                loading={loadingRealTimeData}
                error={realTimeError}
              />
            </MotionBox>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Delivery tips based on real-time data */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TipsContainer>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.warning.main, 0.15),
                    color: theme.palette.warning.main,
                    mr: 2,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.warning.main,
                      0.2
                    )}`,
                  }}
                >
                  <TipsAndUpdatesIcon sx={{ fontSize: 28 }} />
                </Box>
                <SectionTitle variant="h6">
                  Delivery Tips & Updates
                </SectionTitle>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box component="ul" sx={{ pl: 2 }}>
                {realTimeData?.weather && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Typography component="li" variant="body2" paragraph>
                      <strong>Current weather:</strong>{" "}
                      {realTimeData.weather.conditions},{" "}
                      {realTimeData.weather.temperature.current}°
                      {realTimeData.weather.temperature.units}.{" "}
                      {realTimeData.weather.conditions
                        .toLowerCase()
                        .includes("rain") &&
                        "Consider providing water-proof packaging today."}
                      {realTimeData.weather.conditions
                        .toLowerCase()
                        .includes("snow") &&
                        "Drive cautiously and allow extra time for deliveries."}
                    </Typography>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography component="li" variant="body2" paragraph>
                    Check weather forecasts before planning your routes.
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Typography component="li" variant="body2" paragraph>
                    Avoid highly congested areas (7+ traffic level) when
                    possible.
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Typography component="li" variant="body2" paragraph>
                    Plan around festival areas, as traffic patterns may change
                    unexpectedly.
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Typography component="li" variant="body2" paragraph>
                    Use the prediction system to find optimal delivery windows
                    for each customer.
                  </Typography>
                </motion.div>
              </Box>
            </TipsContainer>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Summary Stats */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ mb: 4 }}
      >
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                initial="rest"
              >
                <StatCard color={stat.color}>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: alpha(stat.color, 0.15),
                          color: stat.color,
                          mr: 2,
                          boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="h6">{stat.title}</Typography>
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        color: stat.color,
                        textShadow: `0 2px 10px ${alpha(stat.color, 0.3)}`,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </StatCard>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Charts */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {/* Success Rate Chart */}
          <Grid item xs={12} lg={8}>
            <MotionBox variants={itemVariants}>
              <ChartContainer elevation={3} sx={{ p: 3 }}>
                <Box sx={{ height: "350px" }}>
                  <Line data={successRateData} options={lineOptions} />
                </Box>
              </ChartContainer>
            </MotionBox>
          </Grid>

          {/* Failure Reasons Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <MotionBox variants={itemVariants}>
              <ChartContainer elevation={3} sx={{ p: 3 }}>
                <Box sx={{ height: "350px" }}>
                  <Pie data={failureReasonsData} options={pieOptions} />
                </Box>
              </ChartContainer>
            </MotionBox>
          </Grid>

          {/* Deliveries by Area */}
          <Grid item xs={12}>
            <MotionBox variants={itemVariants}>
              <ChartContainer elevation={3} sx={{ p: 3 }}>
                <Box sx={{ height: "350px" }}>
                  <Bar data={deliveriesByAreaData} options={barOptions} />
                </Box>
              </ChartContainer>
            </MotionBox>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Recent Activity */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{ mt: 4 }}
      >
        <StyledPaper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                mr: 2,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              }}
            >
              <AccessTimeIcon />
            </Box>
            <SectionTitle variant="h6">Recent Activity</SectionTitle>
          </Box>
          <Stack spacing={2} sx={{ py: 1 }}>
            {dashboardData?.recent_activities?.map((activity, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <ActivityItem activity={activity} index={index} />
              </MotionBox>
            ))}
            {(!dashboardData?.recent_activities ||
              dashboardData.recent_activities.length === 0) && (
              <Box
                sx={{
                  py: 4,
                  textAlign: "center",
                  color: "text.secondary",
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: theme.shape.borderRadius * 2,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Box>
            )}
          </Stack>
        </StyledPaper>
      </MotionBox>
    </PageContainer>
  );
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const theme = useTheme();
  let backgroundColor = alpha(theme.palette.background.paper, 0.7);
  let color = theme.palette.grey[600];
  let icon = <AccessTimeIcon />;

  // Determine background color and icon based on activity type
  switch (activity.action) {
    case "Delivery":
      backgroundColor = alpha(theme.palette.success.main, 0.1);
      color = theme.palette.success.main;
      icon = <CheckIcon />;
      break;
    case "Failed Delivery":
      backgroundColor = alpha(theme.palette.error.main, 0.1);
      color = theme.palette.error.main;
      icon = <CloseIcon />;
      break;
    case "Route Optimized":
      backgroundColor = alpha(theme.palette.primary.main, 0.1);
      color = theme.palette.primary.main;
      icon = <TrendingUpIcon />;
      break;
    case "Weather Alert":
      backgroundColor = alpha(theme.palette.warning.main, 0.1);
      color = theme.palette.warning.main;
      icon = <ThermostatIcon />;
      break;
    default:
      break;
  }

  return (
    <ActivityCard bgcolor={backgroundColor}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start">
          <ActivityIconBox sx={{ backgroundColor: color }}>
            {icon}
          </ActivityIconBox>
          <Box sx={{ flex: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" component="div" fontWeight="bold">
                {activity.action}
              </Typography>
              <Chip
                label={activity.time}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 24,
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(10px)",
                  fontWeight: 600,
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.common.black,
                    0.05
                  )}`,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: alpha(theme.palette.text.primary, 0.7),
              }}
            >
              {activity.details}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </ActivityCard>
  );
};

export default Dashboard;
