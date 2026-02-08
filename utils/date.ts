function appendAgo(diffMs: number, suffix: "d" | "w" | "m"): string {
    return `${diffMs}${suffix} ago`;
}

export function getTime(datetime: string): string {
  const dt = new Date(datetime);
  const now = Date.now();

  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const hr = 1000 * 60 * 60;
  const day = hr * 24;
  const week = day * 7;
  const month = week * 4;

  const diffMs = Math.abs(dt.getTime() - now);

  if (diffMs < day) {
    return `Today ${timeFmt.format(dt)}`;
  }

  if (diffMs < week) {
    return appendAgo(Math.floor(diffMs / day), "d");
  }

  if (diffMs < month) {
    return appendAgo(Math.floor(diffMs / week), "w");
  }

  return dateFmt.format(dt);
}


