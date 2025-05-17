import Layout from "@/components/Layout"
import Map from "@/components/Map"

export default function Dashboard() {
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
          Rail Defect Dashboard
        </h1>
        <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow">
          <Map />
        </div>
      </div>
    </Layout>
  )
}
