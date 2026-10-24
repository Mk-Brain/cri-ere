import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet, useNavigate } from "react-router";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSideBar";
import SitemarkIcon from "../../assets/logo4.png";
import styled from "@emotion/styled";
import { useAuth } from "../../hooks/useAuthContext";
import { CircularProgress } from "@mui/material";

const Logo = styled.img``;

export default function Home() {
const {user, loading} = useAuth()
const navigate = useNavigate()
React.useEffect(()=>{
  
  if (user) {
    const uid = user.uid;
    console.log("User is signed in with UID:", uid);
    //navigate("/visites")
    // ...
  } else {
    // User is signed out
    navigate("/login")
  }

},[navigate, user])

  const theme = useTheme();

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(true);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ],
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded],
  );

  const [layoutContainer, setLayoutContainer] =React.useState<HTMLDivElement | null>(null);

  if(loading)
    return <Box sx={{
      width:"100%",
      height:"100%",
      alignItems:"center",
      justifyContent:"center"
    }}>
      <CircularProgress/>
    </Box>

  return (
    <Box
      ref={setLayoutContainer}
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        height: "100vh",
        width: "100%",
      }}
    >
      <DashboardHeader
        logo={<Logo src={SitemarkIcon} alt="logo" />}
        title="CRI-ERE"
        menuOpen={isNavigationExpanded}
        onToggleMenu={handleToggleHeaderMenu}
      />
      <DashboardSidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutContainer ?? undefined}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ displayPrint: "none" }} />
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
