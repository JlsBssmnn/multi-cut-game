import { Dispatch, SetStateAction } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import InputIcon from "@mui/icons-material/Input";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

const levelCount = 8;

const keywords: string[] = [];
async function initKeywords() {
  for (let i = 1; i <= levelCount; i++) {
    const { keyword } = await import(`../../pages/level${i}`);
    keywords.push(keyword);
  }
}
initKeywords();

export interface SidebarProps {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ drawerOpen, setDrawerOpen }: SidebarProps) {
  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box
        sx={{ width: 300 }}
        role="presentation"
        onClick={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem disablePadding>
            <Link href={`/`}>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Start Page"}
                  primaryTypographyProps={{ fontSize: "1.2rem" }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider />
          <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            Main Levels
          </ListSubheader>
          {Array.from(new Array(levelCount).keys()).map((i) => (
            <ListItem key={i + 1} disablePadding>
              <Link href={`/level${i + 1}`}>
                <ListItemButton>
                  <ListItemText
                    primary={`- Level ${i + 1} (${keywords[i]})`}
                    primaryTypographyProps={{ fontSize: "1.2rem" }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <Divider />
          <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            More Levels
          </ListSubheader>
          <ListItem disablePadding>
            <Link href={`/levelGeneration`}>
              <ListItemButton>
                <ListItemIcon>
                  <EngineeringIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Level Generation"}
                  primaryTypographyProps={{ fontSize: "1.2rem" }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href={`/levelImport`}>
              <ListItemButton>
                <ListItemIcon>
                  <InputIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Level Import"}
                  primaryTypographyProps={{ fontSize: "1.2rem" }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
