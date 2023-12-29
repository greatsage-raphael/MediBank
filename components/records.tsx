import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "./card"

interface Record {
  author: string;
  summary: string;
  doctor: string;
  reason: string;
  time: string;
  dateAdded: string;
  appointment: string;
}

interface RecordsProps {
  records: any[] | undefined;
}

const Records: React.FC<RecordsProps> = ({ records }) => {
  if (!records) {
    return <p>No medical records found.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4">
        <h2 className="text-xl font-semibold mb-4">Your Medical Records</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {records.map((record, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{record.reason}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Performed by: {record.doctor}</p>
              <p>Summary: </p>
              <p>{record.summary}</p>
              <p>Added on: {record.dateAdded}</p>
              <p>Appointment Scheduled For: {record.appointment}</p>
            </CardContent>
            <CardFooter>
            <button
              className="bg-teal-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2"
              type="submit"
              >
              Delete ❌
            </button>

            <button
              className="bg-teal-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2"
              type="submit"
              >
              Edit ✏️
            </button>

            <button
              className="bg-teal-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mx-2"
              type="submit"
              >
              share 📤
            </button>
            </CardFooter>
          </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


export default Records;