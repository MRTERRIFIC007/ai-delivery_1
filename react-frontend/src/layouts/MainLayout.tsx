import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  styled,
  alpha,
  Paper,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  SwipeableDrawer,
  Badge,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
  AccountCircle as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  SmartToy as SmartToyIcon,
  Route as RouteIcon,
  Receipt as ReceiptIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Logo image
import logo from "../assets/logo.png";

const drawerWidth = 280;

// Navigation items
const navItems = [
  { name: "Dashboard", path: "/", icon: <DashboardIcon />, notification: 0 },
  {
    name: "Prediction",
    path: "/prediction",
    icon: <TimelineIcon />,
    notification: 0,
  },
  { name: "History", path: "/history", icon: <HistoryIcon />, notification: 0 },
  { name: "Chat", path: "/chat", icon: <SmartToyIcon />, notification: 4 },
  { name: "Route", path: "/route", icon: <RouteIcon />, notification: 0 },
  {
    name: "Pending Orders",
    path: "/pending-orders",
    icon: <ReceiptIcon />,
    notification: 7,
  },
];

// Secondary nav items
const secondaryNavItems = [
  {
    name: "Settings",
    icon: <SettingsIcon />,
    subitems: [
      { name: "Profile", path: "/settings/profile" },
      { name: "Preferences", path: "/settings/preferences" },
      { name: "Notifications", path: "/settings/notifications" },
    ],
  },
  { name: "Help", path: "/help", icon: <HelpIcon />, notification: 0 },
];

// Define more specific type
interface CustomAppBarProps extends Omit<MuiAppBarProps, "open"> {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  backdropFilter: "blur(8px)",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 5,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const GlassBox = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<HTMLElement | null>(null);
  const [expandedItem, setExpandedItem] = useState("");
  const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    navigate("/login");
  };

  const handleExpandClick = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? "" : itemName);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would trigger a theme change
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Dashboard";

    for (const item of navItems) {
      if (item.path === currentPath) return item.name;
    }

    for (const section of secondaryNavItems) {
      if (section.path === currentPath) return section.name;
      if (section.subitems) {
        for (const subitem of section.subitems) {
          if (subitem.path === currentPath)
            return `${section.name} - ${subitem.name}`;
        }
      }
    }

    return "DeliverEase";
  };

  const drawer = (
    <Box
      component={motion.div}
      initial={{ x: -drawerWidth }}
      animate={{ x: 0 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowX: "hidden",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.background.paper,
                0.9
              )} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(180deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={logo}
            alt="Logo"
            sx={{
              height: 40,
              width: 40,
              marginRight: 2,
              boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          />
          <Typography
            variant="h6"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            DeliverEase
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </DrawerHeader>
      <Divider sx={{ opacity: 0.1 }} />
      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * navItems.indexOf(item) }}
          >
            <ListItem
              disablePadding
              sx={{
                mb: 0.5,
                overflow: "hidden",
                borderRadius: 2,
                bgcolor:
                  location.pathname === item.path
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={isMobile ? () => setMobileOpen(false) : undefined}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  position: "relative",
                  "&::after":
                    location.pathname === item.path
                      ? {
                          content: '""',
                          position: "absolute",
                          left: -1,
                          top: "50%",
                          height: "60%",
                          width: 4,
                          bgcolor: "primary.main",
                          transform: "translateY(-50%)",
                          borderRadius: "0 4px 4px 0",
                          boxShadow: `0 0 8px ${alpha(
                            theme.palette.primary.main,
                            0.5
                          )}`,
                        }
                      : {},
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "text.secondary",
                    minWidth: 36,
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                  }}
                >
                  {item.notification > 0 ? (
                    <StyledBadge badgeContent={item.notification} color="error">
                      {item.icon}
                    </StyledBadge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
      <Divider sx={{ my: 1.5, opacity: 0.1 }} />
      <List sx={{ px: 1 }}>
        {secondaryNavItems.map((section) => (
          <React.Fragment key={section.name}>
            {section.subitems ? (
              <>
                <ListItem
                  disablePadding
                  sx={{
                    mb: 0.5,
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                >
                  <ListItemButton
                    onClick={() => handleExpandClick(section.name)}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.name}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                      }}
                    />
                    {expandedItem === section.name ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={expandedItem === section.name}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {section.subitems.map((subitem) => (
                      <ListItemButton
                        key={subitem.name}
                        component={Link}
                        to={subitem.path}
                        sx={{
                          pl: 6,
                          py: 1,
                          borderRadius: 2,
                          mx: 1,
                          mb: 0.5,
                          bgcolor:
                            location.pathname === subitem.path
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                        selected={location.pathname === subitem.path}
                        onClick={
                          isMobile ? () => setMobileOpen(false) : undefined
                        }
                      >
                        <ListItemText
                          primary={subitem.name}
                          primaryTypographyProps={{
                            fontSize: "0.85rem",
                            fontWeight:
                              location.pathname === subitem.path ? 500 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItem
                  disablePadding
                  sx={{ mb: 0.5, borderRadius: 2, overflow: "hidden" }}
                >
                  <ListItemButton
                    component={Link}
                    to={section.path}
                    selected={location.pathname === section.path}
                    onClick={isMobile ? () => setMobileOpen(false) : undefined}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      position: "relative",
                      "&::after":
                        location.pathname === section.path
                          ? {
                              content: '""',
                              position: "absolute",
                              left: -1,
                              top: "50%",
                              height: "60%",
                              width: 4,
                              bgcolor: "primary.main",
                              transform: "translateY(-50%)",
                              borderRadius: "0 4px 4px 0",
                            }
                          : {},
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {section.notification > 0 ? (
                        <StyledBadge
                          badgeContent={section.notification}
                          color="error"
                        >
                          {section.icon}
                        </StyledBadge>
                      ) : (
                        section.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.name}
                      primaryTypographyProps={{
                        fontWeight:
                          location.pathname === section.path ? 600 : 400,
                        fontSize: "0.95rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />

      <GlassBox
        sx={{
          m: 2,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            App Version
          </Typography>
          <IconButton
            size="small"
            onClick={toggleDarkMode}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            {darkMode ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          DeliverEase v2.0.1
        </Typography>
      </GlassBox>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && !isMobile}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="h6" noWrap component="div">
                {getCurrentPageTitle()}
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{
                  mr: 1,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <Badge badgeContent={11} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                size="large"
                aria-label="account settings"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    border: "2px solid white",
                    boxShadow: `0 0 15px ${alpha(
                      theme.palette.common.white,
                      0.3
                    )}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                  }}
                >
                  <AccountIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={userMenuAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleUserMenuClose} sx={{ minWidth: 180 }}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
          <Menu
            id="menu-notifications"
            anchorEl={notificationsAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                width: 320,
                maxHeight: 400,
                overflow: "auto",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Recent Notifications
              </Typography>
            </Box>
            <Divider />
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" fontWeight="500">
                  7 new orders ready for delivery
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" fontWeight="500">
                  New message from support team
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  25 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" fontWeight="500">
                  Traffic alert: Congestion on Main Street
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  1 hour ago
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1, textAlign: "center" }}>
              <Typography variant="body2" color="primary">
                View all notifications
              </Typography>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: open ? drawerWidth : 72 }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </SwipeableDrawer>
        ) : (
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: open ? drawerWidth : 72,
                transition: theme.transitions.create(["width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: "hidden",
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${open ? drawerWidth : 72}px)` },
          ml: { md: `${open ? drawerWidth : 72}px` },
          mt: "64px",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ height: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default MainLayout;
