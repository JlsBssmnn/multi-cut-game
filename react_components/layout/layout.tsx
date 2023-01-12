import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import Sidebar from "./Sidebar";
import AppHead from "./AppHead";
import { levelCount } from "../../utils/constants";
import Link from "next/link";

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

  let levelNavigationInfo;
  const split = title.split(" ");

  let levelNumber;
  if (
    split.length === 2 &&
    split[0] === "Level" &&
    (levelNumber = parseInt(split[1]))
  ) {
    levelNavigationInfo = {
      levelNumber,
      goBackPossible: levelNumber > 1,
      goForwardPossible: levelNumber < levelCount,
    };
  }

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
            {levelNavigationInfo && (
              <>
                <Link href={`/level${levelNavigationInfo.levelNumber - 1}`}>
                  <IconButton disabled={!levelNavigationInfo.goBackPossible}>
                    <ArrowBackIosNewIcon
                      sx={{
                        color: levelNavigationInfo.goBackPossible
                          ? "white"
                          : "rgba(0, 0, 0, 0.26)",
                      }}
                    />
                  </IconButton>
                </Link>
                <Link href={`/level${levelNavigationInfo.levelNumber + 1}`}>
                  <IconButton disabled={!levelNavigationInfo.goForwardPossible}>
                    <ArrowForwardIosIcon
                      sx={{
                        color: levelNavigationInfo.goForwardPossible
                          ? "white"
                          : "rgba(0, 0, 0, 0.26)",
                      }}
                    />
                  </IconButton>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      {children}
    </>
  );
}
