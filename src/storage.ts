export function readSaved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(`maybeverse:${key}`);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(`maybeverse:${key}`, JSON.stringify(value));
  } catch {
    /* Private browsing or full storage should never spoil the visit. */
  }
}

export function localDay() {
  const now = new Date();
  return {
    key: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
    index: Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
    ),
    label: now.toLocaleDateString("id-ID", { day: "numeric", month: "long" }),
  };
}

export function chooseOther(length: number, previous: number) {
  if (length < 2) return 0;
  const candidate = Math.floor(Math.random() * (length - 1));
  return candidate >= previous ? candidate + 1 : candidate;
}
