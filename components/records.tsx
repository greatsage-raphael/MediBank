import { Web5 } from "@web5/api";
import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "./card"
import { useState } from "react";
import { useRouter } from "next/router";
import { Badge } from "lucide-react";


interface Record {
  id: string;
  author: string;
  summary: string;
  doctor: string;
  reason: string;
  time: string;
  dateAdded: string;
  appointment: string;
  image: string;
}

interface RecordsProps {
  records: Record[] | undefined;
  did: string;
  web5: Web5 | null;
}

const Records: React.FC<RecordsProps> = ({ records, did, web5 }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()


  if (!records) {
    return <p>No medical records found.</p>;
  }

  console.log("Records", records)

  const deleteRecord = async (recordId: string) => {
    setIsDeleting(true)
    console.log('deleting', recordId);
    if (!web5 || !did) {
      console.error("Web5 or did is missing");
      return;
    }
    
    const response = await web5.dwn.records.delete({
      from: did,
      message: {
        recordId: recordId,
      },
    });
  
    if (response.status.code === 200) {
      console.log(`Record:${recordId} deleted successfully`);
      alert(`Medical Record Deleted Successfully: ${recordId}`)
    } else {
      console.error("Error while deleting record:", response.status);
    }

    
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
            <img
                alt={record.reason}
                className="mb-2"
                height="600"
                src={record.image}
                style={{
                  aspectRatio: "100/100",
                  objectFit: "cover",
                }}
                width="1000"
              />
              <p>Performed by: {record.doctor}</p>
              <p>Summary: </p>
              <p>{record.summary}</p>
              <p>Added on: {record.dateAdded}</p>
              <p>Appointment Scheduled For: {record.appointment}</p>
              <div>
              
              </div>
            </CardContent>
            <CardFooter>

            <button
             className={`bg-teal-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2`}
             type="submit"
             onClick={() => deleteRecord(record.id)}
             disabled={isDeleting}
           >
             {isDeleting ? "Deleting..." : "Delete " }
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