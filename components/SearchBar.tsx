import { Guild } from "discord.js";
import { useRouter } from "next/router";
import { FC, FormEventHandler, useEffect, useState } from "react";

const SearchBar: FC<{ guild: Guild; query: string }> = ({ guild, query }) => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(query);
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const router = useRouter();
  const search: FormEventHandler = (e) => {
    e.preventDefault();

    router.push({ pathname: `/${guild.id}/search`, query: { q: searchValue } });
  };

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
  }, [router]);

  return (
    <form onSubmit={search}>
      <label>
        Search{" "}
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
