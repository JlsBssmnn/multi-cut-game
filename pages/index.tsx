import Image from "next/image";
import styles from "../styles/Home.module.scss";
import moveOutAnimation from "../public/moveOutAnimation.gif";
import moveToClusterAnimation from "../public/moveToClusterAnimation.gif";
import joinClustersAnimation from "../public/joinClustersAnimation.gif";
import costLocation from "../public/costLocation.png";
import { Button } from "@mui/material";
import Link from "next/link";

export default function StartPage() {
  return (
    <>
      <div className={styles.main}>
        <h1 className={styles.mainHeading}>Welcome to the Multicut Game!</h1>

        <h2 className={styles.heading}>What is this game about?</h2>
        <p className={styles.description}>
          This game let's you interactively solve the multicut problem: You are
          given a graph with nodes and edges. Each edge has a cost of either -1
          (red edge) or 1 (green edge). Nodes connected by green edges want to
          be in the same cluster whereas nodes connected with red edges want to
          be in different clusters.
          <br />
          There are different levels in ascending difficulty. If you find the
          optimal solution, you will be notified. There is also the option to
          create your own levels.
        </p>

        <h3 className={styles.heading}>How to play the game?</h3>
        <p className={styles.description}>
          The game is played by dragging nodes or clusters. There are 3
          different actions that you can perform:
        </p>
        <br />
        <div className={styles.bulletPointList}>
          <div className={styles.listItem}>
            Move a node out of it's cluster
            <div className={styles.animation}>
              <Image src={moveOutAnimation} alt="Move out animation" />
            </div>
          </div>
          <div className={styles.listItem}>
            Move a node to a different cluster
            <div className={styles.animation}>
              <Image
                className={styles.animation}
                src={moveToClusterAnimation}
                alt="Move to cluster animation"
              />
            </div>
          </div>
          <div className={styles.listItem}>
            Join two clusters
            <div className={styles.animation}>
              <Image
                src={joinClustersAnimation}
                alt="Join clusters animation"
              />
            </div>
          </div>
        </div>

        <h2 className={styles.heading}>What's the goal of the game?</h2>
        <p className={styles.description}>
          The goal of the game is to find the optimal solution or one of the
          optimal solutions if there are multiple. The optimal solution is the
          multicut that has the smallest possible cost. You can see the cost of
          your current multicut to the left or on top of the graph (depending on
          your screen size).
        </p>
        <br />
        <Image src={costLocation} />

        <h2 className={styles.heading}>
          What are the buttons on the picture above doing?
        </h2>
        <p className={styles.description}>
          There are 3 buttons to the left or above the graph (again depending on
          the screen size). They can be used during the game to get some help.
        </p>
        <br />
        <ul className={styles.description}>
          <li>
            <span className={styles.bulletPointHeading}>
              Show optimal cost:
            </span>
            <br />
            This button is a toggle and will show you the cost of the optimal
            solution. If you click the button again, the optimal cost will be
            hidden. It can be used to determine how close you are to the optimal
            solution.
          </li>
          <li>
            <span className={styles.bulletPointHeading}>Show hint:</span>
            <br />
            This will give you a hint by showing you one edge in the graph that
            is not correct w.r.t. the optimal solution. The incorrect edge will
            blink for 3 seconds. If you can't see the edge despite not having
            reached the optimal solution make sure you can see all edges, so no
            edge is completely overlapping another one. If an edge between two
            nodes in the same cluster blinks it means that these two nodes
            should actually be in two different clusters. If an edge between two
            clusters blinks it means that some nodes of either cluster should
            actually be in the same cluster. Note that just joining or
            separating the adjacent nodes/cluster of the blinking edge might
            lead you into an endless cycle.
          </li>
          <li>
            <span className={styles.bulletPointHeading}>
              Show optimal solution:
            </span>
            <br />
            This button will open a dialog which shows you how the optimal
            solution looks like. It can help you to get a feeling of how many
            clusters there should be and how large they are going to be. Usually
            it's not trivial to find the optimal solution just from seeing this
            one.
          </li>
        </ul>

        <h2 className={styles.heading}>How to create more levels?</h2>
        <p className={styles.description}>
          You can use the Level Generator to create your own levels! Just
          specify the parameters in the box on the left and click on "show
          graph".
          <br />
          You can try to solve your level but the optimal solution will not be
          computed automatically since this can take some time. But you can
          manually start the calculation by clicking the "compute solution"
          button. If the solution has been computed you also have access to the
          three buttons described in the previous section.
          <br />
          If you want to start over again you can use the "reset graph" button
          which will reset you multicut to a singleton clustering.
          <br />
          If you want to save your level for playing it later or sharing it you
          can press the "download level" button which will download the graph
          and, if computed, the optimal solution. The file can be used by going
          to the Level Import page then clicking on the icon on the bottom left
          and then selecting the downloaded file. If the file doesn't contain an
          optimal solution the optimal solution will be computed when the file
          is loaded.
        </p>

        <h2 className={styles.heading}>Are you ready for the first level?</h2>
        <Link href="/level1">
          <Button variant="contained" sx={{ fontSize: "2rem" }}>
            Go to first level
          </Button>
        </Link>
      </div>
      <div style={{ marginBottom: "10vh" }} />
    </>
  );
}
