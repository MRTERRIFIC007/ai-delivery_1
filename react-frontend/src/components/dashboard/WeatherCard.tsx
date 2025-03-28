import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid,
  Alert,
  Skeleton,
  Tooltip,
  alpha,
  styled,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  WbSunny as SunnyIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  Visibility as VisibilityIcon,
  WaterDrop as HumidityIcon,
  Cloud as CloudIcon,
  Refresh as RefreshIcon,
  Thunderstorm as ThunderstormIcon,
  AcUnit as SnowIcon,
  FilterDrama as CloudyIcon,
  Grain as HazeIcon,
} from "@mui/icons-material";
import { WeatherData } from "../../types/index";
import { motion } from "framer-motion";

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(20px)",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: `0 20px 80px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: `0 30px 100px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  overflow: "hidden",
}));

const GradientHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(135deg, ${
    theme.palette.primary.dark
  } 0%, ${alpha(theme.palette.primary.main, 0.85)} 100%)`,
  color: theme.palette.common.white,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at top right, ${alpha(
      theme.palette.primary.light,
      0.3
    )} 0%, transparent 70%)`,
    zIndex: 0,
  },
  "& .MuiCardHeader-content": {
    position: "relative",
    zIndex: 1,
  },
  "& .MuiCardHeader-action": {
    color: alpha(theme.palette.common.white, 0.9),
    marginTop: 0,
    marginRight: 0,
    position: "relative",
    zIndex: 1,
  },
}));

const WeatherInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: alpha(theme.palette.background.default, 0.5),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.primary.light, 0.15)}`,
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
    transform: "translateY(-5px) scale(1.05)",
    background: alpha(theme.palette.background.default, 0.7),
  },
}));

const WeatherIconContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 150,
  height: 150,
  margin: "0 auto",
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 120,
    height: 120,
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.2
    )}, ${alpha(theme.palette.secondary.main, 0.2)})`,
    boxShadow: `0 0 60px ${alpha(theme.palette.primary.main, 0.4)}`,
    zIndex: 0,
    animation: "pulse 3s infinite ease-in-out",
  },
}));

// Helper function to get the appropriate weather icon
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition?.toLowerCase() || "";

  // Default styles for all icons
  const commonStyles = { fontSize: 80 };

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return (
      <SunnyIcon
        sx={{
          ...commonStyles,
          color: "warning.main",
          filter: "drop-shadow(0 0 12px rgba(255,193,7,0.5))",
        }}
      />
    );
  } else if (
    lowerCondition.includes("rain") ||
    lowerCondition.includes("drizzle")
  ) {
    return (
      <RainIcon
        sx={{
          ...commonStyles,
          color: "info.main",
          filter: "drop-shadow(0 0 12px rgba(3,169,244,0.5))",
        }}
      />
    );
  } else if (lowerCondition.includes("cloud")) {
    return (
      <CloudyIcon
        sx={{
          ...commonStyles,
          color: "grey.400",
          filter: "drop-shadow(0 0 12px rgba(158,158,158,0.5))",
        }}
      />
    );
  } else if (lowerCondition.includes("snow")) {
    return (
      <SnowIcon
        sx={{
          ...commonStyles,
          color: "info.light",
          filter: "drop-shadow(0 0 12px rgba(179,229,252,0.7))",
        }}
      />
    );
  } else if (
    lowerCondition.includes("thunder") ||
    lowerCondition.includes("storm")
  ) {
    return (
      <ThunderstormIcon
        sx={{
          ...commonStyles,
          color: "error.main",
          filter: "drop-shadow(0 0 15px rgba(244,67,54,0.6))",
        }}
      />
    );
  } else if (
    lowerCondition.includes("fog") ||
    lowerCondition.includes("haze") ||
    lowerCondition.includes("mist")
  ) {
    return (
      <HazeIcon
        sx={{
          ...commonStyles,
          color: "grey.400",
          filter: "drop-shadow(0 0 10px rgba(158,158,158,0.4))",
        }}
      />
    );
  } else {
    return (
      <CloudIcon
        sx={{
          ...commonStyles,
          color: "primary.light",
          filter: "drop-shadow(0 0 12px rgba(33,150,243,0.5))",
        }}
      />
    );
  }
};

interface WeatherCardProps {
  data?: WeatherData | null;
  summary?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  summary,
  loading = false,
  error = null,
  onRefresh,
}) => {
  // Modify formatTemp to handle the correct temperature object structure
  // Modify formatTemp to handle object or number
  const formatTemp = (
    temp?: number | { current: number; feels_like: number; units: string }
  ) => {
    if (temp === undefined) return "N/A";
    if (typeof temp === "object" && "current" in temp) {
      return `${temp.current}°${temp.units || "C"}`;
    }
    return `${temp}°C`;
  };

  // Render loading state
  if (loading) {
    return (
      <GlassCard>
        <GradientHeader
          title={
            <Skeleton
              variant="text"
              width="60%"
              sx={{ bgcolor: alpha("#fff", 0.2) }}
            />
          }
          action={
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ bgcolor: alpha("#fff", 0.2) }}
            />
          }
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mb: 1, bgcolor: alpha("#000", 0.07) }}
            />
            <Skeleton
              variant="text"
              width={120}
              sx={{ bgcolor: alpha("#000", 0.07) }}
            />
            <Skeleton
              variant="text"
              width={60}
              sx={{ bgcolor: alpha("#000", 0.07) }}
            />
          </Box>

          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={80}
                  sx={{
                    bgcolor: alpha("#000", 0.07),
                    borderRadius: 2,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </GlassCard>
    );
  }

  // Render error state
  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard>
          <GradientHeader
          title="Weather"
            action={
              <IconButton color="inherit" size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            }
        />
        <CardContent>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: (theme) =>
                  `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}`,
              }}
            >
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Unable to load weather data. Please try refreshing.
          </Typography>
        </CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // Render no data state
  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard>
          <GradientHeader
          title="Weather"
            action={
              <IconButton color="inherit" size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            }
        />
        <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CloudIcon
                sx={{
                  fontSize: 64,
                  mb: 2,
                  opacity: 0.4,
                  color: "text.secondary",
                }}
              />
              <Typography variant="body1" color="text.secondary" gutterBottom>
            No weather data available.
          </Typography>
              {onRefresh && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton onClick={onRefresh} sx={{ mt: 1 }}>
                    <RefreshIcon />
                  </IconButton>
                </motion.div>
              )}
            </Box>
        </CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // Extract values correctly from the WeatherData interface
  const { temperature, conditions, humidity } = data;
  // Get wind speed from the wind object if available
  const wind_speed = data.wind?.speed;
  // Visibility is not in our interface, use a placeholder
  const visibility = "N/A";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <GlassCard>
        <GradientHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  repeatType: "loop" as const,
                }}
              >
                <TempIcon
                  sx={{
                    mr: 1,
                    filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
                  }}
                />
              </motion.div>
              <Typography variant="h6" component="div">
                Weather Conditions
              </Typography>
            </Box>
          }
          action={
            <motion.div whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }}>
              <IconButton color="inherit" size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </motion.div>
          }
      />
      <CardContent>
        {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {summary}
          </Typography>
            </motion.div>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
              mt: summary ? 2 : 0,
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <WeatherIconContainer>
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: conditions?.toLowerCase().includes("wind")
                    ? [0, 10, -10, 0]
                    : 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse" as const,
                  duration: 5,
                  ease: "easeInOut",
                }}
                style={{ zIndex: 1, position: "relative" }}
              >
                {getWeatherIcon(conditions || "")}
              </motion.div>
            </WeatherIconContainer>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            >
              <Typography
                variant="h2"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: (theme) =>
                    `0 2px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  letterSpacing: "-1px",
                }}
              >
                {formatTemp(temperature)}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Typography
                variant="h5"
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  color: getConditionColor(conditions || "", theme),
                  textShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                {conditions}
              </Typography>
            </motion.div>
            </Box>

          <Grid container spacing={3}>
            <Grid
              item
              xs={6}
              sm={3}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
            >
              <WeatherInfoItem>
                <motion.div
                  whileHover={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <Box sx={{ color: "info.main", mb: 1 }}>
                    <HumidityIcon fontSize="large" />
                  </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600}>
                  {humidity !== undefined ? `${humidity}%` : "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Humidity
                </Typography>
              </WeatherInfoItem>
            </Grid>

            <Grid
              item
              xs={6}
              sm={3}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            >
              <WeatherInfoItem>
                <motion.div
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.7, ease: "easeInOut" },
                  }}
                >
                  <Box sx={{ color: "success.main", mb: 1 }}>
                    <WindIcon fontSize="large" />
                  </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600}>
                  {wind_speed !== undefined ? `${wind_speed} km/h` : "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Wind
                </Typography>
              </WeatherInfoItem>
            </Grid>

            <Grid
              item
              xs={6}
              sm={3}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            >
              <WeatherInfoItem>
                <motion.div
                  whileHover={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5 },
                  }}
                >
                  <Box sx={{ color: "warning.main", mb: 1 }}>
                    <VisibilityIcon fontSize="large" />
                  </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600}>
                  {visibility}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Visibility
                </Typography>
              </WeatherInfoItem>
            </Grid>

            <Grid
              item
              xs={6}
              sm={3}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
            >
              <WeatherInfoItem>
                <motion.div
                  whileHover={{
                    y: [0, -5, 5, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <Box sx={{ color: "error.main", mb: 1 }}>
                    <TempIcon fontSize="large" />
            </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600}>
                  {formatTemp(temperature)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Temperature
                </Typography>
              </WeatherInfoItem>
            </Grid>
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            style={{ marginTop: "1rem" }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    0.05
                  )} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                backdropFilter: "blur(10px)",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transform: "translateZ(0)", // Force GPU rendering for smoother animations
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 15px 60px rgba(0,0,0,0.15)",
                  transform: "translateY(-3px) translateZ(0)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <CloudIcon
                    sx={{ mr: 1.5, color: "primary.main", fontSize: 30 }}
                  />
                </motion.div>
                <Typography variant="body1" fontWeight={600}>
                  Today's Forecast
                </Typography>
              </Box>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    background: (theme) =>
                      `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {conditions}
              </Typography>
              </motion.div>
            </Paper>
          </motion.div>
      </CardContent>
      </GlassCard>
    </motion.div>
  );
};

// Helper function to determine color based on weather condition
const getConditionColor = (condition: string, theme: any) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return theme.palette.warning.main;
  } else if (
    lowerCondition.includes("rain") ||
    lowerCondition.includes("drizzle")
  ) {
    return theme.palette.info.main;
  } else if (lowerCondition.includes("cloud")) {
    return theme.palette.grey[500];
  } else if (lowerCondition.includes("snow")) {
    return theme.palette.info.light;
  } else if (
    lowerCondition.includes("thunder") ||
    lowerCondition.includes("storm")
  ) {
    return theme.palette.error.main;
  } else if (
    lowerCondition.includes("fog") ||
    lowerCondition.includes("haze") ||
    lowerCondition.includes("mist")
  ) {
    return theme.palette.grey[400];
  } else {
    return theme.palette.primary.main;
  }
};

export default WeatherCard;
