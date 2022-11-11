import GlobalStyles from "components/GlobalStyles";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-dracula.css";

const WikicordApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
};

export default WikicordApp;
