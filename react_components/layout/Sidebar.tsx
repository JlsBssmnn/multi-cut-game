import { Dispatch, SetStateAction } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import Link from "next/link";

const levelCount = 4;

const descriptions = ["complete", "grid", "tree", "random"];

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
          <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            Main Levels
          </ListSubheader>
          {Array.from(new Array(levelCount).keys()).map((i) => (
            <ListItem key={i + 1} disablePadding>
              <Link href={`/level${i + 1}`}>
                <ListItemButton>
                  <ListItemText
                    primary={`- Level ${i + 1} (${descriptions[i]})`}
                    primaryTypographyProps={{ fontSize: "1.2rem" }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <Divider />
        </List>
      </Box>
    </Drawer>
  );
}
