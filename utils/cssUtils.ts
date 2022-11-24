import styles from "../styles/Game.module.scss";

/**
 * This function returns whether the user is on a phone, tablet or desktop.
 */
export function getUserDevice(
  width: number,
  height: number
): "phone" | "tablet" | "desktop" {
  if (width >= parseInt(styles.breakpointDesktop)) {
    return "desktop";
  } else if (width >= parseInt(styles.breakpointTablet)) {
    return "tablet";
  } else {
    return "phone";
  }
}
