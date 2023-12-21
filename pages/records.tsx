import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "../components/card"
import Link from "next/link";

export default function Component() {

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4">
        <h2 className="text-xl font-semibold mb-4">Your Medical Records</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>General Checkup</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Performed on: 2023-12-01</p>
              <p>Performed by: Dr. John Doe</p>
              <p>Summary: Regular health checkup. No issues detected.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dental Checkup</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Performed on: 2023-11-20</p>
              <p>Performed by: Dr. Jane Smith</p>
              <p>Summary: Regular dental checkup. One cavity detected and treated.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Eye Checkup</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Performed on: 2023-11-15</p>
              <p>Performed by: Dr. Alice Johnson</p>
              <p>Summary: Regular eye checkup. Vision remains 20/20.</p>
            </CardContent>
          </Card>
          <Link className="mx-2 text-gray-500 hover:text-gray-900" href="/">
          <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Add Record
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

























