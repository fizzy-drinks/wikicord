import { NextPage } from "next";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import "prism-themes/themes/prism-dracula.css";

const Styles = createGlobalStyle`
  html {
    font-family: Merriweather, serif;
    line-height: 1.5;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h1 {
    font-size: 2em;
    margin: 0;
  }

  article {
    h1 {
      font-size: 1.8em;
    }
  }

  h2 {
    font-size: 1.35em;
  }

  h3 {
    font-size: 1.2em;
  }

  h4 {
    font-size: 1.1em;
  }

  main {
    margin-top: 1rem;
  }
`;

const WikicordApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Styles />
      <Component {...pageProps} />
    </>
  );
};

export default WikicordApp;
