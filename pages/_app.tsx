import { NextPage } from "next";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import "prism-themes/themes/prism-dracula.css";

const Styles = createGlobalStyle`
  html {
    font-family: Merriweather, serif;
    line-height: 1.5;
    max-width: 1600px;
    margin: 0 auto;
  }

  code {
    background-color: #eee;
    display: inline-block;
    font-size: 1rem;
    border-radius: 2px;
  }

  a {
    text-decoration: none;
    color: #36a;

    &:hover {
      text-decoration: underline;
    }
  }

  h1 {
    font-size: 2em;
    margin: 0;
  }

  article,
  section {
    h1 {
      font-size: 1.8em;
      border-bottom: 1px solid #eee;
    }
  }

  h2 {
    font-size: 1.45em;
  }

  h3 {
    font-size: 1.3em;
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
