const SORA_NOTES_STORAGE_KEY = "kokoro-compass-sora-notes";

export type SavedSoraNote = {
  id: string;
  label: string;
  content: string;
  createdAt: string;
};

export const saveSoraNote = (note: Omit<SavedSoraNote, "id" | "createdAt">) => {
  if (typeof window === "undefined") {
    return false;
  }

  const nextNote: SavedSoraNote = {
    id: crypto.randomUUID(),
    label: note.label,
    content: note.content,
    createdAt: new Date().toISOString(),
  };

  try {
    const current = window.localStorage.getItem(SORA_NOTES_STORAGE_KEY);
    const parsed = current ? (JSON.parse(current) as SavedSoraNote[]) : [];
    window.localStorage.setItem(
      SORA_NOTES_STORAGE_KEY,
      JSON.stringify([nextNote, ...parsed].slice(0, 50)),
    );
    return true;
  } catch {
    return false;
  }
};
