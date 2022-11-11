import { useRouter } from "next/router";
import { FC, FormEventHandler, useEffect, useState } from "react";
import { GuildData } from "utils/types/Guild";

const SearchBar: FC<{ guildData: GuildData; query: string }> = ({
  guildData: { alias, guild },
  query,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(query);
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const router = useRouter();
  const search: FormEventHandler = (e) => {
    e.preventDefault();

    router.push({
      pathname: `/${alias || guild.id}/search`,
      query: { q: searchValue },
    });
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
