import Layout from "@/components/Layout";
import Map from "@/components/Map";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Rail Defect Dashboard</h1>
      <Map />
    </Layout>
  );
}
