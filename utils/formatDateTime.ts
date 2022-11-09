import format from "date-fns/format";

const formatDateTime = (dateString: string) =>
  format(new Date(dateString), "MMM dd, yyyy HH:MM:ss");

export default formatDateTime;
