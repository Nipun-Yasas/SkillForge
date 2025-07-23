"use client";
import { createTheme } from "@mui/material/styles";

import { outlinedInputClasses } from "@mui/material/OutlinedInput";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        secondary: {
          main: "#6A0DAD",
          light: "#8B3DCC",
          dark: "#4A0080",
          contrastText: "#fff",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff",
        },
        warning: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        info: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        success: {
          main: "#28a745",
          light: "#5CBF70",
          dark: "#1C7A32",
          contrastText: "#fff",
        },
        accent: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        landHeader: {
          main: "#ffffff",
          contrastText: "#000000",
        },
        textblack: {
          main: "#000000",
          contrastText: "#ffffff",
        },
        shapeColor: {
          main: "#6A0DAD",
        },
        featureColor: {
          main: "#f8fbff",
        },
        footerColor: {
          main: "#007BFF",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        secondary: {
          main: "#6A0DAD",
          light: "#8B3DCC",
          dark: "#4A0080",
          contrastText: "#fff",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff",
        },
        warning: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        info: {
          main: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056CC",
          contrastText: "#fff",
        },
        success: {
          main: "#28a745",
          light: "#5CBF70",
          dark: "#1C7A32",
          contrastText: "#fff",
        },
        accent: {
          main: "#FF7A00",
          light: "#FF9F40",
          dark: "#CC5500",
          contrastText: "#fff",
        },
        landHeader: {
          main: "#1a1a1a",
          contrastText: "#ffffff",
        },
        textblack: {
          main: "#ffffff",
          contrastText: "#000000",
        },
        shapeColor: {
          main: "#4A0080",
        },
        featureColor: {
          main: "#2a2a2a",
        },
        footerColor: {
          main: "#0056CC",
        },
      },
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-borderColor": "#007BFF",
          "--TextField-borderHoverColor": "#6A0DAD",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--TextField-borderColor)",
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-borderHoverColor)",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&::before, &::after": {
            borderBottom: "2px solid var(--TextField-borderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-borderHoverColor)",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&::before": {
            borderBottom: "2px solid var(--TextField-borderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-borderHoverColor)",
          },
        },
      },
    },
  },
  typography: {
    fontFamily:
      'Inter, Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      color: "#007BFF",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      color: "#007BFF",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      color: "#6A0DAD",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      color: "#6A0DAD",
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#333333",
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#666666",
    },
    button: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      textTransform: "none",
    },
  },
});

// Enhance theme with beautiful sidebar styling
theme.components = {
  ...theme.components,
  // Toolpad Core DashboardLayout sidebar styling
  MuiDrawer: {
    styleOverrides: {
      paper: {
        background: 'linear-gradient(180deg, #f8fbff 0%, #e3f2fd 100%)',
        borderRight: '1px solid rgba(0, 123, 255, 0.1)',
        boxShadow: '4px 0 20px rgba(0, 123, 255, 0.08)',
        '& .MuiListItemButton-root': {
          margin: '4px 12px',
          borderRadius: '12px',
          padding: '12px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(106, 13, 173, 0.05) 100%)',
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
            },
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
            '& .MuiListItemText-primary': {
              color: '#fff',
              fontWeight: 600,
            },
          },
        },
        '& .MuiListItemIcon-root': {
          minWidth: '40px',
          color: '#007BFF',
          transition: 'all 0.3s ease',
        },
        '& .MuiListItemText-primary': {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: '0.95rem',
          color: '#2c3e50',
        },
        '& .MuiListSubheader-root': {
          background: 'transparent',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          color: '#6A0DAD',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '16px 16px 8px 16px',
          lineHeight: 1.2,
        },
        '& .MuiDivider-root': {
          margin: '8px 16px',
          borderColor: 'rgba(0, 123, 255, 0.1)',
        },
      },
    },
  },
  // App bar styling
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: 'linear-gradient(135deg, #fff 0%, #f8fbff 100%)',
        color: '#2c3e50',
        boxShadow: '0 2px 20px rgba(0, 123, 255, 0.08)',
        borderBottom: '1px solid rgba(0, 123, 255, 0.1)',
      },
    },
  },
};

export default theme;
