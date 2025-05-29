import { API_BASE_URL } from "../api";

export async function createReport(data: any) {
  const res = await fetch(`${API_BASE_URL}/reports/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create report");
  return res.json();
}