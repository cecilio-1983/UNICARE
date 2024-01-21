import React, { createContext, useContext, useState } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      localStorage.setItem("darkMode", prevMode ? "false" : "true");
      return !prevMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        lighter: "#C8FAD6",
        light: "#5BE49B",
        main: "#11844F",
        dark: "#007867",
        darker: "#004B50",
      },
      secondary: {
        lighter: "#B0E693",
        light: "#86CA6E",
        main: "#6FD546",
        dark: "#5CA93E",
        darker: "#4B8835",
      },
    },
    components: {
      MuiInput: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            color: (theme) => theme.palette.text.secondary,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            color: (theme) => theme.palette.text.secondary,
          },
          inputMultiline: {
            overflow: "hidden",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "rgba(130, 130, 130, 0.5)",
            fontSize: "14px",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            paddingBottom: "16px !important",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "5px 5px 20px 5px rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            fontSize: "14px",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          title: {
            fontSize: "18px",
          },
          subheader: {
            fontSize: "12px",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            color: (theme) => theme.palette.text.secondary,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            overflowY: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(128, 128, 128, 0.5)",
            },
          },
        },
      },
    },
    link: "#198AFF",
    selectedMenu: "rgba(15, 112, 41, 0.1)",
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
