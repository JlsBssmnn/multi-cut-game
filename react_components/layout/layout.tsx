import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Sidebar from "./Sidebar";
import AppHead from "./AppHead";

export interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const matches = title.matchAll(/(\d|[A-Z])/g);
  Array.from(matches).forEach((match) => {
    if (match.index !== undefined && match.index !== 0) {
      title = title.slice(0, match.index) + " " + title.slice(match.index);
    }
  });

  return (
    <>
      <AppHead />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      {children}
    </>
  );
}
