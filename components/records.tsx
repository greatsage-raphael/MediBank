import { Web5 } from "@web5/api";
import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "./card"
import { SVGProps, useState } from "react";
import { useRouter } from "next/router";
import { useModal } from "./recipient";
import { useToast } from "../components/use-toast";


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
  web5: Web5;
}

const Records: React.FC<RecordsProps> = ({ records, did, web5 }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { DemoModal, setShowDemoModal } = useModal();
  const { toast } = useToast()
  
  const router = useRouter()


  if (!records || records.length <= 0) {
    return ( 
      <div className="flex items-center space-x-3">
        <p>No medical records found. Attempting to retrieve records  </p>
        {loadingIcon({className: "h-3 w-3"})}
      </div>
    );
  }

  //console.log("Records", records)

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
      toast({
             description: "Record deleted successfully",
           })
    } else {
      console.error("Error while deleting record:", response.status);
      toast({
        description: "Record deleted successfully",
      })
    }
  }
 

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4">
        <h2 className="text-xl font-semibold mb-4">Your Medical Records</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          
        {records.map((record, index) => (
          record &&
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
             className={`inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mx-2`}
             type="submit"
             onClick={() => deleteRecord(record.id)}
           >
             Delete 
           </button>

           <div>
           {DemoModal(web5, record.id)} 
          <button
            onClick={() => setShowDemoModal(true)}
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Record
          </button> 
        </div>
            </CardFooter>
          </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


export default Records;


function loadingIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
<svg width="30" height="30" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#000">
    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 67 67"
            to="-360 67 67"
            dur="2.5s"
            repeatCount="indefinite"/>
    </path>
    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 67 67"
            to="360 67 67"
            dur="8s"
            repeatCount="indefinite"/>
    </path>
</svg>
 )
}