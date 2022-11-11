import axios from "axios";
import { FC, useState, FormEventHandler } from "react";
import styled from "styled-components";
import { GuildData } from "utils/types/Guild";

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin: 0.25rem 0;

  input {
    border-radius: 2px;
    border: 1px solid #999;
    padding: 0.25rem;
  }
`;

type Status =
  | "inactive"
  | "checking"
  | "available"
  | "not-available"
  | "saving"
  | "error"
  | "success";

const statusLabels: Record<Status, string> = {
  inactive: "",
  checking: "Verifying availability...",
  available: "Available!",
  "not-available": "This alias is already in use.",
  saving: "Saving...",
  error: "There was an error updating the server alias.",
  success: "Alias set!",
};

const GuildAliasEdit: FC<{
  guildData: GuildData;
  onChange: (alias: string) => void;
}> = ({ guildData, onChange }) => {
  const [status, setStatus] = useState<Status>("inactive");
  const [guildAlias, setGuildAlias] = useState(guildData.alias ?? "");

  const verifyAlias = async () => {
    if (!guildAlias || guildAlias === guildData.alias) return;

    setStatus("checking");
    const {
      data: { available },
    } = await axios.get<{ available: boolean }>("/api/alias/" + guildAlias);

    setStatus(available ? "available" : "not-available");
  };

  const changeServerAlias: FormEventHandler = async (event) => {
    event.preventDefault();

    setStatus("saving");
    try {
      await axios.put(`/api/${guildData.guild.id}/preferences/alias`, {
        alias: guildAlias,
      });
      setStatus("success");
      onChange(guildAlias);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const canChangeAlias = ["inactive", "available", "not-available"].includes(
    status
  );

  return (
    <form onSubmit={changeServerAlias}>
      <InputGroup>
        <label htmlFor="alias-input">Server alias</label>
        <input
          id="alias-input"
          value={guildAlias}
          onChange={(e) => setGuildAlias(e.target.value)}
          onBlur={verifyAlias}
          disabled={!canChangeAlias}
        />
        <small>{statusLabels[status]}</small>
      </InputGroup>
      <button type="submit" disabled={status !== "available"}>
        Save
      </button>
    </form>
  );
};

export default GuildAliasEdit;
