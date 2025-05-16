import { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function TestPDF() {
  const reportRef = useRef(null);

  const handleGeneratePDF = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: "rapport-test.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <button
        onClick={handleGeneratePDF}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Générer PDF
      </button>

      <div ref={reportRef} className="bg-white p-6 mt-6 rounded shadow">
        <h1 className="text-2xl font-bold">Rapport d'intervention</h1>
        <p>Date : {new Date().toISOString().split("T")[0]}</p>
        <p>Technicien : Bouchra Amari</p>
        <p>Description : Ceci est un test de génération PDF.</p>
      </div>
    </div>
  );
}
