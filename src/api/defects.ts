import { API_BASE_URL } from "../api";

export async function fetchDefects() {
  const res = await fetch(`${API_BASE_URL}/defects`);
  if (!res.ok) throw new Error("Failed to fetch defects");
  return res.json();
}

export async function updateDefect(defectId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/defects/${defectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update defect");
  return res.json();
}