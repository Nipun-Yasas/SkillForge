'use client';
import { createTheme } from '@mui/material/styles';

import { outlinedInputClasses } from '@mui/material/OutlinedInput';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0077B6",
          light: "#33A1E0",
          dark: "#004D80",
          contrastText: "#fff",
        },
        secondary: {
          main: "#00B4D8",
          light: "#4CD9FF",
          dark: "#007A94",
          contrastText: "#000000",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff"
        },
        warning: {
          main: "#ed6c02",
          light: "#ff9800",
          dark: "#e65100",
          contrastText: "#fff"
        },
        info: {
          main: "#0288d1",
          light: "#03a9f4",
          dark: "#01579b",
          contrastText: "#fff"
        },
        success: {
          main: "#2e7d32",
          light: "#4caf50",
          dark: "#1b5e20",
          contrastText: "#fff"
        },
        landHeader: {
          main: '#ffffff',
          contrastText: '#000000',
        },
        textblack: {
          main: '#000000',
          contrastText: '#ffffff',
        },
        shapeColor: {
          main: '#00B4D8',
        },
        featureColor: {
          main: '#e3f2fd',
        },
        footerColor: {
          main:'#2196f3',
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: "#0077B6",
          light: "#33A1E0",
          dark: "#004D80",
          contrastText: "#fff",
        },
        secondary: {
          main: "#00B4D8",
          light: "#4CD9FF",
          dark: "#007A94",
          contrastText: "#000000",
        },
        error: {
          main: "#F44336",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#fff"
        },
        warning: {
          main: "#ffa726",
          light: "#ffb74d",
          dark: "#f57c00",
          contrastText: "rgba(0, 0, 0, 0.87)"
        },
        info: {
          main: "#29b6f6",
          light: "#4fc3f7",
          dark: "#0288d1",
          contrastText: "rgba(0, 0, 0, 0.87)"
        },
        success: {
          main: "#66bb6a",
          light: "#81c784",
          dark: "#388e3c",
          contrastText: "rgba(0, 0, 0, 0.87)"
        },
        landHeader: {
          main: '#ffffff',
          contrastText: '#000000',
        },
        textblack: {
          main: '#ffffff',
          contrastText: '#000000',
        },
        shapeColor: {
          main: '#0d47a1',
        },
        featureColor: {
          main: '#1976d2',
        },
        footerColor: {
          main:'#0d47a1',
        }
      },
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-borderColor': '#E0E3E7',
          '--TextField-borderHoverColor': '#E90A4D',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'var(--TextField-borderColor)',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-borderHoverColor)',
          },

        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            borderBottom: '2px solid var(--TextField-borderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '2px solid var(--TextField-borderHoverColor)',
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottom: '2px solid var(--TextField-borderColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '2px solid var(--TextField-borderHoverColor)',
          }
        }
      }
    }
  },
  typography: {
    fontFamily: 'Lexend, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#0077B6',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#0077B6',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#0077B6',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
      color: '#0077B6',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      fontFamily: 'Poppins, sans-serif',
    },
    h7: {
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'Poppins, sans-serif',
    },
  },
});

export default theme;
