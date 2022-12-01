import { ReactNode } from "react";
import { getUserDevice } from "../../utils/cssUtils";
import styles from "../../styles/GameTools.module.scss";

export interface GameToolWrapperProps {
  children: ReactNode;
  device: ReturnType<typeof getUserDevice>;
}

export default function GameToolWrapper({
  children,
  device,
}: GameToolWrapperProps) {
  if (device !== "phone") {
    return <>{children}</>;
  }
  return <div className={styles.wrapper}>{children}</div>;
}
