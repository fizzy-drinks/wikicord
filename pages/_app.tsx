import { NextPage } from "next";
import { AppProps } from "next/app";

const WikicordApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: 1.5 }}>
      <Component {...pageProps} />
    </div>
  );
};

export default WikicordApp;
