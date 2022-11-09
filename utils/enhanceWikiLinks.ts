const enhanceWikiLinks = (body: string) => {
  const linkRegex = /\[(.+)\]\((.+)\s(.+)\)/g;
  const replaced = body
    .replace(/\[\[(.+)\]\]/g, "[$1]($1)")
    .replace(linkRegex, "[$1]($2_$3)");

  return replaced.search(linkRegex) > -1
    ? enhanceWikiLinks(replaced)
    : replaced;
};

export default enhanceWikiLinks;
