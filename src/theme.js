import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5252",
      light: "#ffa0a0",
      dark: "#cc3838",
      contrastText: "#fff",
    },
    secondary: {
      main: "#404040",
      light: "#737373",
      dark: "#171717",
      contrastText: "#fff",
    },
    error: {
      main: "#ef4444",
      light: "#fee2e2",
      dark: "#b91c1c",
    },
    success: {
      main: "#22c55e",
      light: "#dcfce7",
      dark: "#15803d",
    },
    warning: {
      main: "#f59e0b",
      light: "#fef3c7",
      dark: "#b45309",
    },
    info: {
      main: "#3b82f6",
      light: "#dbeafe",
      dark: "#1d4ed8",
    },
    text: {
      primary: "#171717",
      secondary: "#525252",
      disabled: "#a3a3a3",
    },
    background: {
      paper: "#ffffff",
      default: "#f5f5f5",
    },
    divider: "#e5e5e5",
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(255, 82, 82, 0.08)",
      disabledBackground: "#f5f5f5",
      focus: "rgba(255, 82, 82, 0.12)",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      color: "#737373",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    "0 25px 50px -12px rgba(0,0,0,0.25)",
    ...Array(18).fill("0 25px 50px -12px rgba(0,0,0,0.25)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#e04848",
          },
        },
        outlinedPrimary: {
          borderColor: "#ff5252",
          "&:hover": {
            borderColor: "#e04848",
            backgroundColor: "rgba(255, 82, 82, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontSize: "0.875rem",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff5252",
              borderWidth: 1,
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(255, 82, 82, 0.15)",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#ff5252",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e5e5",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          minHeight: 44,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#ff5252",
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: "#ff5252",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.625rem",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: "#f59e0b",
        },
        iconHover: {
          color: "#f59e0b",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: "#f0fdf4",
          color: "#15803d",
        },
        standardError: {
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
        },
        standardWarning: {
          backgroundColor: "#fffbeb",
          color: "#b45309",
        },
        standardInfo: {
          backgroundColor: "#eff6ff",
          color: "#1d4ed8",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
