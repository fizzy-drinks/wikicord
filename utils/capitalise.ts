const capitalise = (phrase: string) => {
  const spaced = phrase.replace("_", " ").toLowerCase();
  return spaced[0].toUpperCase().concat(spaced.slice(1));
};

export default capitalise;
