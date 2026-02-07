export const getPrimaryTag = (id: string) =>
  id.includes("/") ? id.split("/")[0] : "untagged";
