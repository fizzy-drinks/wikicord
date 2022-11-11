import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const LoaderBar: FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeError", () => setLoading(false));
    router.events.on("routeChangeComplete", () => setLoading(false));
  }, [router]);

  return (
    <motion.aside
      variants={{
        start: {
          width: "1px",
          opacity: 1,
        },
        loading: {
          width: ["0.5%", "30%", "70%", "100%"],
          opacity: 1,
          transition: {
            times: [0, 0.02, 0.1, 1],
            duration: 120,
            opacity: {
              duration: 0,
            },
          },
        },
        rest: {
          width: "100%",
          opacity: 0,
          transition: {
            duration: 0.5,
            opacity: {
              duration: 2,
              delay: 0.5,
            },
          },
        },
      }}
      initial="start"
      animate={loading ? "loading" : "rest"}
      style={{
        display: "block",
        borderBottom: "2px solid #36a",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default LoaderBar;
