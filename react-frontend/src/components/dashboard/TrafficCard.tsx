import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid,
  Alert,
  Chip,
  Skeleton,
  Tooltip,
  alpha,
  styled,
  IconButton,
  LinearProgress,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Timer as TimerIcon,
  LocationOn as LocationIcon,
  Traffic as TrafficIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { TrafficData, TrafficAreaData } from "../../types/index";
import { motion } from "framer-motion";

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(20px)",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: `0 20px 80px 0 ${alpha(theme.palette.error.main, 0.15)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: `0 30px 100px 0 ${alpha(theme.palette.error.main, 0.25)}`,
  },
  overflow: "hidden",
}));

const GradientHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${alpha(
    theme.palette.error.main,
    0.85
  )} 100%)`,
  color: theme.palette.common.white,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  position: "relative",
  overflow: "hidden",
  boxShadow: `0 4px 20px ${alpha(theme.palette.error.main, 0.2)}`,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at top right, ${alpha(
      theme.palette.error.light,
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

interface CongestionBarProps {
  congestionLevel: number;
}

const CongestionBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "congestionLevel",
})<CongestionBarProps>(({ theme, congestionLevel }) => {
  let color = theme.palette.success.main;
  if (congestionLevel > 3 && congestionLevel <= 6) {
    color = theme.palette.warning.main;
  } else if (congestionLevel > 6) {
    color = theme.palette.error.main;
  }

  return {
    height: 10,
    borderRadius: 8,
    backgroundColor: alpha(color, 0.2),
    boxShadow: `0 0 10px ${alpha(color, 0.25)}`,
    overflow: "hidden",
    position: "relative",
    "& .MuiLinearProgress-bar": {
      borderRadius: 8,
      background: `linear-gradient(90deg, ${alpha(color, 0.8)}, ${color})`,
      boxShadow: `0 0 15px ${alpha(color, 0.5)}`,
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(90deg, transparent, ${alpha(
          theme.palette.common.white,
          0.2
        )}, transparent)`,
        animation: "shimmer 2s infinite",
      },
    },
  };
});

interface StatusChipProps {
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const StatusChip = styled(Chip)<StatusChipProps>(
  ({ theme, color = "primary" }) => {
    // Ensure we're using a valid palette color
    const colorKey = color as keyof typeof theme.palette;
    const mainColor =
      theme.palette[colorKey]?.main || theme.palette.primary.main;

    return {
      fontWeight: 700,
      boxShadow: `0 4px 12px ${alpha(mainColor, 0.2)}`,
      border: `1px solid ${alpha(mainColor, 0.2)}`,
      background: `linear-gradient(135deg, ${alpha(mainColor, 0.9)}, ${alpha(
        mainColor,
        0.7
      )})`,
      color: "#fff",
      textShadow: `0 1px 2px ${alpha(mainColor, 0.5)}`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px) scale(1.05)",
        boxShadow: `0 6px 15px ${alpha(mainColor, 0.3)}`,
      },
      "& .MuiChip-label": {
        padding: "3px 10px",
      },
    };
  }
);

interface AreaBoxProps {
  active?: boolean;
}

const AreaBox = styled(Paper)<AreaBoxProps>(({ theme, active }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: active
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.error.main,
        0.05
      )} 0%, ${alpha(theme.palette.error.light, 0.1)} 100%)`
    : alpha(theme.palette.background.default, 0.6),
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    active
      ? alpha(theme.palette.error.main, 0.15)
      : alpha(theme.palette.divider, 0.08)
  }`,
  boxShadow: active
    ? `0 10px 30px ${alpha(theme.palette.error.main, 0.15)}`
    : "none",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    transform: "translateY(-5px) scale(1.02)",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const PulseIconWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "140%",
    height: "140%",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    background: alpha(theme.palette.error.main, 0.2),
    animation: "pulse 2s infinite",
    zIndex: 0,
  },
  "& .MuiSvgIcon-root": {
    position: "relative",
    zIndex: 1,
  },
}));

interface TrafficCardProps {
  data?: TrafficData | null;
  summary?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const TrafficCard: React.FC<TrafficCardProps> = ({
  data,
  summary,
  loading = false,
  error = null,
  onRefresh,
}) => {
  const theme = useTheme();

  // If loading, show a loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
            <Skeleton
              variant="text"
              width="90%"
              sx={{ bgcolor: alpha("#000", 0.1) }}
            />
            <Skeleton
              variant="text"
              width="80%"
              sx={{ mb: 2, bgcolor: alpha("#000", 0.1) }}
            />

            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={6} key={i}>
                  <Skeleton
                    variant="rounded"
                    height={80}
                    sx={{
                      bgcolor: alpha("#000", 0.07),
                      borderRadius: theme.shape.borderRadius * 2,
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Skeleton
              variant="rounded"
              height={80}
              sx={{
                mt: 3,
                bgcolor: alpha("#000", 0.07),
                borderRadius: theme.shape.borderRadius * 2,
              }}
            />
          </CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard>
          <GradientHeader
            title="Traffic"
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
              icon={
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <InfoIcon />
                </motion.div>
              }
            >
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Unable to load traffic data. Please try refreshing.
            </Typography>
          </CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // If no data, show empty state
  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard>
          <GradientHeader
            title="Traffic"
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
              <TrafficIcon
                sx={{
                  fontSize: 64,
                  mb: 2,
                  opacity: 0.4,
                  color: "text.secondary",
                }}
              />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No traffic data available.
              </Typography>
              {onRefresh && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label="Refresh Data"
                    icon={<RefreshIcon />}
                    onClick={onRefresh}
                    sx={{ mt: 1 }}
                  />
                </motion.div>
              )}
            </Box>
          </CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  // Helper function to get color based on congestion level
  const getTrafficColor = (level: number) => {
    if (level < 4) return theme.palette.success.main; // Light
    if (level < 7) return theme.palette.warning.main; // Normal to Moderate
    return theme.palette.error.main; // Heavy to Severe
  };

  // Helper function to get label based on congestion level
  const getTrafficLabel = (level: number) => {
    if (level < 4) return "Light";
    if (level < 7) return "Moderate";
    if (level < 9) return "Heavy";
    return "Severe";
  };

  // Get the overall city congestion
  const overallCongestion = data.overall_city_congestion || 5;
  const overallColor = getTrafficColor(overallCongestion);

  // Extract areas with highest congestion
  const areaEntries = Object.entries(data)
    .filter(
      ([key, value]) =>
        key !== "overall_city_congestion" &&
        key !== "status" &&
        typeof value === "object"
    )
    .sort((a, b) => {
      const aLevel = (a[1] as any).congestion_level || 0;
      const bLevel = (b[1] as any).congestion_level || 0;
      return bLevel - aLevel;
    })
    .slice(0, 3); // Get top 3 most congested areas

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
                animate={{
                  rotate: [0, -10, 0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  repeatType: "loop" as const,
                  ease: "easeInOut",
                }}
              >
                <TrafficIcon
                  sx={{
                    mr: 1.5,
                    filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))",
                  }}
                />
              </motion.div>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                Traffic Conditions
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
              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 500, mb: 2, pl: 1 }}
              >
                {summary}
              </Typography>
            </motion.div>
          )}

          <Box sx={{ mt: 1, mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  <PulseIconWrapper>
                    <CarIcon
                      fontSize="medium"
                      sx={{
                        mr: 1.5,
                        color: "error.main",
                        filter: "drop-shadow(0 0 5px rgba(244,67,54,0.5))",
                      }}
                    />
                  </PulseIconWrapper>
                </motion.div>
                Traffic by Area
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  gap: 2,
                  px: 1,
                  py: 1,
                  borderRadius: 2,
                  background: alpha(theme.palette.background.default, 0.6),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      mr: 1,
                      boxShadow: `0 0 8px ${alpha(
                        theme.palette.success.main,
                        0.5
                      )}`,
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Light
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Medium
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    High
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <Grid container spacing={2}>
              {areaEntries.map(([area, info]: [string, any], index) => {
                const level = info.congestion_level || 0;
                const color = getTrafficColor(level);

                return (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={area}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <AreaBox active={level > 6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: color,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                              color: level > 6 ? "error.main" : "text.primary",
                            }}
                          >
                            {area}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TimerIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {info.delay_minutes} min
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 0.5 }}>
                        <CongestionBar
                          variant="determinate"
                          value={level * 10}
                          congestionLevel={level}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {info.status || "Traffic information not available"}
                        </Typography>
                        <StatusChip
                          label={`${level}/10`}
                          size="small"
                          color={level > 6 ? "error" : "success"}
                          variant="outlined"
                        />
                      </Box>
                    </AreaBox>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {typeof data.overall_city_congestion === "number" && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              sx={{ mt: 2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(
                      theme.palette.info.light,
                      0.1
                    )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
                  backdropFilter: "blur(8px)",
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                    }}
                  >
                    <Box sx={{ position: "relative", mr: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={overallCongestion * 10}
                        size={56}
                        thickness={4}
                        sx={{
                          color: overallColor,
                          boxShadow: (theme) =>
                            `0 0 10px ${alpha(overallColor, 0.5)}`,
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          {overallCongestion}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Overall City Status
                      </Typography>
                      {data.status && (
                        <Typography variant="body2" color="text.secondary">
                          {data.status}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "center", ml: "auto" }}
                  >
                    <StatusChip
                      label={Math.random() > 0.5 ? "↑ 12%" : "↓ 8%"}
                      size="small"
                      icon={
                        Math.random() > 0.5 ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )
                      }
                      color={Math.random() > 0.5 ? "error" : "success"}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </CardContent>
      </GlassCard>
    </motion.div>
  );
};

export default TrafficCard;
