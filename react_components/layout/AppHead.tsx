import Head from "next/head";

export default function AppHead() {
  return (
    <Head>
      <title>Multicut Game</title>
      <meta
        name="description"
        content="A game where you can interactively solve the multicut problem."
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/icon.svg" />
    </Head>
  );
}
