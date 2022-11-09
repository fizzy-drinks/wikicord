import { NextPage } from "next";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";

const Styles = createGlobalStyle`
  html {
    font-family: Merriweather, serif;
    line-height: 1.5;
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
