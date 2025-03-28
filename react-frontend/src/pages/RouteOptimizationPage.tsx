import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  styled,
} from "@mui/material";
import {
  Route as RouteIcon,
  DirectionsCar as CarIcon,
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Traffic as TrafficIcon,
  Map as MapIcon,
  Refresh as RefreshIcon,
  Warehouse as WarehouseIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  NavigateNext as NavigateNextIcon,
  Navigation as NavigationIcon,
  LocalShipping as DeliveryIcon,
  AltRoute as AltRouteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import useStore from "../store/useStore";
import MapComponent from "../components/map/MapComponent";

// Styled components for enhanced visuals
const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background: `radial-gradient(circle at top right, ${alpha(
      theme.palette.primary.light,
      0.15
    )}, transparent 70%)`,
    zIndex: 0,
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
  height: "100%",
  border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 15px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0.9
  )}, ${alpha(theme.palette.primary.main, 0.85)})`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 15px 50px ${alpha(theme.palette.primary.main, 0.3)}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at top right, ${alpha(
      theme.palette.primary.light,
      0.4
    )}, transparent 60%)`,
    zIndex: 0,
  },
}));

const AnimatedArrow = styled(motion.div)({
  display: "flex",
  alignItems: "center",
});

const RouteItemCard = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
  boxShadow: `0 5px 20px ${alpha(theme.palette.common.black, 0.05)}`,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderColor: alpha(theme.palette.primary.main, 0.3),
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

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(1),
    borderRadius: "50%",
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    boxShadow: `0 5px 15px ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

const ViewMapButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5),
  fontWeight: 600,
  boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.25)}`,
  },
}));

const OptimizeButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.35)}`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, transparent, ${alpha(
      theme.palette.common.white,
      0.2
    )}, transparent)`,
    transform: "translateX(-100%)",
    transition: "transform 0.5s ease",
  },
  "&:hover::after": {
    transform: "translateX(100%)",
  },
}));

const MotionBox = styled(motion.div)({
  width: "100%",
});

const RouteOptimizationPage: React.FC = () => {
  const theme = useTheme();
  const {
    pendingOrders,
    loadingOrders,
    ordersError,
    fetchPendingOrders,
    optimizedRoute,
    loadingRoute,
    routeError,
    optimizeRoute,
    realTimeData,
    loadingRealTimeData,
    realTimeError,
    fetchRealTimeData,
  } = useStore();

  // Local state for selected orders
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Add state to control map visibility
  const [showMap, setShowMap] = useState<boolean>(false);

  // Load orders and real-time data on mount
  useEffect(() => {
    fetchPendingOrders();
    if (!realTimeData) {
      fetchRealTimeData();
    }
  }, [fetchPendingOrders, fetchRealTimeData, realTimeData]);

  // Handle checkbox selection
  const handleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders
  const handleSelectAll = () => {
    if (selectedOrderIds.length === pendingOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(pendingOrders.map((order) => order.order_id));
    }
  };

  // Handle route optimization
  const handleOptimizeRoute = async () => {
    if (selectedOrderIds.length === 0) return;
    await optimizeRoute(selectedOrderIds);
    setShowMap(true); // Automatically show map on route optimization
  };

  // Group orders by area
  const ordersByArea = pendingOrders.reduce<
    Record<string, typeof pendingOrders>
  >((acc, order) => {
    if (!acc[order.area]) {
      acc[order.area] = [];
    }
    acc[order.area].push(order);
    return acc;
  }, {});

  // Format distance/duration for display
  const formatDistanceDuration = (distance?: string, duration?: string) => {
    if (!distance && !duration) return "-";
    return `${distance || "?"} (${duration || "?"})`;
  };

  // Handle map toggle
  const handleToggleMap = () => {
    setShowMap(!showMap);
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
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const routeLegVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (custom: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    }),
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      boxShadow: [
        `0 15px 50px ${alpha(theme.palette.primary.main, 0.3)}`,
        `0 15px 50px ${alpha(theme.palette.primary.main, 0.5)}`,
        `0 15px 50px ${alpha(theme.palette.primary.main, 0.3)}`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <PageContainer maxWidth="xl">
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AltRouteIcon
            color="primary"
            sx={{
              fontSize: 40,
              mr: 2,
              p: 1,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              boxShadow: `0 5px 15px ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
            }}
          />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Route Optimization
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Select orders and optimize the delivery route for maximum
              efficiency
            </Typography>
          </Box>
        </Box>
      </MotionBox>

      {/* Show error alerts only if we don't have an optimized route */}
      {!optimizedRoute && (ordersError || routeError || realTimeError) && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: `0 8px 25px ${alpha(theme.palette.error.main, 0.15)}`,
            }}
          >
            {ordersError || routeError || realTimeError}
          </Alert>
        </MotionBox>
      )}

      <Grid container spacing={4}>
        {/* Left side - Order selection */}
        <Grid item xs={12} md={5}>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledPaper>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <SectionTitle variant="h6">Select Orders</SectionTitle>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAll}
                    sx={{
                      mr: 1,
                      borderRadius: theme.shape.borderRadius * 1.5,
                      px: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 5px 15px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                    }}
                  >
                    {selectedOrderIds.length === pendingOrders.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={fetchPendingOrders}
                    disabled={loadingOrders}
                    sx={{
                      borderRadius: theme.shape.borderRadius * 1.5,
                      px: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 5px 15px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loadingOrders ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    <CircularProgress />
                  </motion.div>
                </Box>
              ) : pendingOrders.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: theme.shape.borderRadius * 1.5,
                    py: 2,
                  }}
                >
                  No pending orders to deliver
                </Alert>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 3,
                      display: "inline-block",
                      py: 0.5,
                      px: 2,
                      borderRadius: theme.shape.borderRadius * 1.5,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  >
                    {selectedOrderIds.length} of {pendingOrders.length} orders
                    selected
                  </Typography>

                  {Object.entries(ordersByArea).map(([area, orders]) => (
                    <motion.div
                      key={area}
                      variants={itemVariants}
                      sx={{ mb: 3 }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            mb: 1.5,
                            color: theme.palette.primary.main,
                          }}
                        >
                          <LocationIcon
                            color="primary"
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                          />
                          {area} ({orders.length})
                        </Typography>

                        <FormGroup
                          sx={{
                            p: 1.5,
                            borderRadius: theme.shape.borderRadius * 1.5,
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.7
                            ),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(
                              theme.palette.primary.light,
                              0.1
                            )}`,
                          }}
                        >
                          {orders.map((order) => (
                            <motion.div
                              key={order.order_id}
                              variants={itemVariants}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedOrderIds.includes(
                                      order.order_id
                                    )}
                                    onChange={() =>
                                      handleOrderSelection(order.order_id)
                                    }
                                    sx={{
                                      color: alpha(
                                        theme.palette.primary.main,
                                        0.7
                                      ),
                                      "&.Mui-checked": {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      {order.name} - {order.package_size}{" "}
                                      package
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {order.address || "No address provided"}
                                    </Typography>
                                  </Box>
                                }
                                sx={{
                                  mb: 1,
                                  pb: 1,
                                  width: "100%",
                                  borderBottom: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.5
                                  )}`,
                                  "&:last-child": {
                                    mb: 0,
                                    pb: 0,
                                    borderBottom: "none",
                                  },
                                }}
                              />
                            </motion.div>
                          ))}
                        </FormGroup>
                      </Box>
                    </motion.div>
                  ))}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptimizeButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={
                        <motion.div
                          animate={{
                            rotate: loadingRoute ? 360 : 0,
                            transition: loadingRoute
                              ? {
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }
                              : { duration: 0 },
                          }}
                        >
                          {loadingRoute ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <NavigationIcon />
                          )}
                        </motion.div>
                      }
                      onClick={handleOptimizeRoute}
                      disabled={loadingRoute || selectedOrderIds.length === 0}
                      sx={{ mt: 3 }}
                    >
                      {loadingRoute ? "Optimizing..." : "Optimize Route"}
                    </OptimizeButton>
                  </motion.div>
                </motion.div>
              )}
            </StyledPaper>
          </MotionBox>
        </Grid>

        {/* Right side - Optimized route display */}
        <Grid item xs={12} md={7}>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StyledPaper>
              <SectionTitle variant="h6">Optimized Route</SectionTitle>

              <Divider sx={{ mb: 3 }} />

              {loadingRoute ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    py: 8,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                  </motion.div>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                  >
                    Calculating optimal route...
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Finding the most efficient delivery path
                  </Typography>
                </Box>
              ) : !optimizedRoute ? (
                <Box sx={{ py: 8, textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DeliveryIcon
                      sx={{
                        fontSize: 80,
                        color: alpha(theme.palette.primary.main, 0.2),
                        mb: 3,
                      }}
                    />
                  </motion.div>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    No Route Generated Yet
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ maxWidth: 400, mx: "auto", mb: 3 }}
                  >
                    Select orders from the left panel and click "Optimize Route"
                    to see the optimized delivery path.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<NavigationIcon />}
                    disabled={selectedOrderIds.length === 0}
                    onClick={handleOptimizeRoute}
                    sx={{
                      borderRadius: theme.shape.borderRadius * 1.5,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Generate Route
                  </Button>
                </Box>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Show warning if there's an error but we have mock route data */}
                  {routeError && (
                    <motion.div variants={itemVariants}>
                      <Alert
                        severity="warning"
                        sx={{
                          mb: 3,
                          borderRadius: theme.shape.borderRadius * 1.5,
                          boxShadow: `0 8px 25px ${alpha(
                            theme.palette.warning.main,
                            0.15
                          )}`,
                        }}
                      >
                        {routeError}
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    variants={itemVariants}
                    animate="pulse"
                    variants={pulseVariants}
                  >
                    <StatsCard>
                      <CardContent sx={{ position: "relative", zIndex: 1 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={6} md={4}>
                            <StatBox>
                              <SpeedIcon sx={{ color: "white" }} />
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.8 }}
                                >
                                  Total Distance
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  {optimizedRoute.total_distance}
                                </Typography>
                              </Box>
                            </StatBox>
                          </Grid>
                          <Grid item xs={6} md={4}>
                            <StatBox>
                              <TimeIcon sx={{ color: "white" }} />
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.8 }}
                                >
                                  Total Duration
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  {optimizedRoute.total_duration}
                                </Typography>
                              </Box>
                            </StatBox>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <StatBox>
                              <TrafficIcon sx={{ color: "white" }} />
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.8 }}
                                >
                                  Total Stops
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  {optimizedRoute?.details?.length || 0}
                                </Typography>
                              </Box>
                            </StatBox>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </StatsCard>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ mb: 3 }}
                    >
                      Route Details
                    </Typography>
                  </motion.div>

                  <motion.div variants={containerVariants}>
                    {optimizedRoute?.details?.map((leg, index) => (
                      <motion.div
                        key={index}
                        custom={index}
                        variants={routeLegVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <RouteItemCard
                          sx={{
                            borderLeft: `4px solid ${
                              index === 0
                                ? theme.palette.primary.main
                                : theme.palette.primary.light
                            }`,
                          }}
                        >
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <Box
                              sx={{
                                backgroundColor:
                                  index === 0
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : alpha(theme.palette.primary.light, 0.1),
                                p: 1,
                                borderRadius: "50%",
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {index === 0 ? (
                                <WarehouseIcon color="primary" />
                              ) : (
                                <HomeIcon color="primary" />
                              )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  fontWeight="bold"
                                  variant="subtitle1"
                                >
                                  {leg.from}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={leg.traffic_conditions || "Unknown"}
                                  color={
                                    leg.traffic_conditions === "Heavy"
                                      ? "error"
                                      : leg.traffic_conditions === "Moderate"
                                      ? "warning"
                                      : "success"
                                  }
                                  sx={{
                                    ml: 1,
                                    fontWeight: 600,
                                    boxShadow:
                                      leg.traffic_conditions === "Heavy"
                                        ? `0 4px 12px ${alpha(
                                            theme.palette.error.main,
                                            0.2
                                          )}`
                                        : leg.traffic_conditions === "Moderate"
                                        ? `0 4px 12px ${alpha(
                                            theme.palette.warning.main,
                                            0.2
                                          )}`
                                        : `0 4px 12px ${alpha(
                                            theme.palette.success.main,
                                            0.2
                                          )}`,
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {leg.from_address}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 2,
                                  mb: 2,
                                }}
                              >
                                <AnimatedArrow
                                  animate={{
                                    x: [0, 5, 0],
                                    transition: {
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    },
                                  }}
                                >
                                  <ArrowIcon color="action" sx={{ mx: 2 }} />
                                </AnimatedArrow>
                                <Chip
                                  label={`${leg.distance} / ${leg.duration}`}
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: alpha(
                                      theme.palette.secondary.main,
                                      0.1
                                    ),
                                    p: 1,
                                    borderRadius: "50%",
                                    mr: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <LocationIcon color="secondary" />
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    {leg.to}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {leg.to_address}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </RouteItemCard>
                      </motion.div>
                    ))}
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  <motion.div variants={itemVariants}>
                    <ViewMapButton
                      variant={showMap ? "contained" : "outlined"}
                      startIcon={<MapIcon />}
                      fullWidth
                      onClick={handleToggleMap}
                      color={showMap ? "primary" : "inherit"}
                    >
                      {showMap ? "Hide Map" : "View on Map"}
                    </ViewMapButton>
                  </motion.div>

                  {showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 400 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          mt: 3,
                          height: 400,
                          width: "100%",
                          borderRadius: theme.shape.borderRadius * 2,
                          overflow: "hidden",
                        }}
                      >
                        <MapComponent />
                      </Box>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </StyledPaper>
          </MotionBox>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default RouteOptimizationPage;
