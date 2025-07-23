"use client";
import { createTheme } from "@mui/material/styles";

import { outlinedInputClasses } from "@mui/material/OutlinedInput";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
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

export default theme;
