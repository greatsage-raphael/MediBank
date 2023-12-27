import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "../components/card"
import {  Web5 } from "@web5/api";
import { useState, useEffect, SVGProps } from "react";
import { useRouter } from 'next/router'
import Records from "../components/records";
import Link from "next/link";


export default function Component() {
    
 const [web5, setWeb5] = useState<Web5 | null>(null)
 const [myDid, setMyDid] = useState<string >("")
 const [doctor, setDoctor] = useState<string>("")
 const [summary, setSummary] = useState<string >("")
 const [reason, setReason] = useState("")
 const [isSaving, setIsSaving] = useState(false)
 const router = useRouter()
 const [allRecords, setAllRecords] = useState<any[] | undefined>(undefined);
 const [showForm, setShowForm] = useState(false);


  //connecting to web5 and logging my credentials
 useEffect(() => {
   const initWeb5 = async () => {
     const { web5, did } = await Web5.connect();


     setWeb5(web5);
     setMyDid(did);


     console.log("web5:", web5)
     console.log("did:", did)


     if (web5 && did) {
       await configureProtocol(web5, did);
     }
   };
    initWeb5();
 }, []);


 ///retrieving Medical Records
 useEffect(() => {
  if (!web5 || !myDid) return; 
  fetchMedicalRecord(web5, myDid).then(records => setAllRecords(records));
}, [web5, myDid, allRecords]);


//defining the mediBank protocol
 const createProtocolDefinition = () => {
   const mediBankProtocolDefinition =
   {
     "protocol": "https://medibank.dev/medical-records-protocol",
     "published": true,
     "types": {
       "medicalRecord": {
         "schema": "https://medibank.dev/medicalRecord",
         "dataFormats": ["application/json"],
       },
     },
     "structure": {
       "medicalRecord": {
         "$actions": [
           {
             "who": "anyone",
             "can": "write"
           },
           {
             "who": "author",
             "of": "medicalRecord",
             "can": "read"
           }
         ],
       },
     },
   };
   return mediBankProtocolDefinition;
 };








 //installing defined protocol
 const installProtocolLocally = async (web5: Web5, protocolDefinition: any) => {
   return await web5.dwn.protocols.configure({
     message: {
       definition: protocolDefinition,
     },
   });
 };


 // console.log("Local Protocol:", installProtocolLocally)




 //Checking for Protocol existence
 const queryForProtocol = async (web5: Web5) => {
   return await web5.dwn.protocols.query({
     message: {
       filter: {
         protocol: "https://medibank.dev/medical-records-protocol",
       },
     },
   });
 };




 // console.log("Query Protocol:", queryForProtocol)


 //configuring the protocol
 const configureProtocol = async (web5: Web5, did: string) => {
   const protocolDefinition = await createProtocolDefinition();


   const { protocols: localProtocol, status: localProtocolStatus } =
       await queryForProtocol(web5);
   console.log( "Local Protocol", localProtocol[0] );
   console.log("LocalProtocolStatus:", localProtocolStatus)
  
   if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
       const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
       console.log("Protocol installed locally", protocol, status);


       // Check if 'protocol' is not undefined before using it
       if (protocol) {
           const { status: configureRemoteStatus } = await protocol.send(did);
           console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
       } else {
           console.error("Protocol is undefined after installation");
       }
   } else {
       console.log("Protocol already installed");
   }
};




//making the medical Record
const constructMedicalRecord = (summary: string, doctor: string, reason: string) => {
 const currentDate = new Date().toLocaleDateString();
 const currentTime = new Date().toLocaleTimeString();
 const medicalRecord = {
   author: myDid,
   summary: summary,
   doctor: doctor,
   reason: reason,
   dateAdded: `${currentDate}`,
   time: `${currentTime}`
 };
 console.log("Medicalrecord:", medicalRecord)
 return medicalRecord;
};




const writeToDwn = async (JSONmedicalRecord: any) => {
 // Check if web5 is not null or undefined
 if (web5) {
  //create a record with the .create method
   const { record } = await web5.dwn.records.create({
     data: JSONmedicalRecord,
     message: {
       protocol: "https://medibank.dev/medical-records-protocol",
       protocolPath: "medicalRecord",
       schema: "https://medibank.dev/medicalRecord",
       dataFormat: "application/json"
     },
   });
   const truth = record
   if(record){
    const {status} = await record.send(myDid);
   }

   console.log("TRUTH:", truth)
   return record;
 } else {
   // Handle the case where web5 is null
   console.error("web5 is null or undefined");
 }

};




const handleSubmit = async (e: any) => {
 e.preventDefault();
 //setIsSaving(true)
 console.log("summary",summary)
 console.log("doctor", doctor)
 console.log("reason", reason)
 console.log("All saved Records", allRecords)
 const medicalRecord = constructMedicalRecord(summary, doctor, reason);
 const JSONmedicalRecord = JSON.stringify(medicalRecord)
 const record = await writeToDwn(JSONmedicalRecord);
 console.log("Logged record", record)
 //setIsSaving(false)
 setShowForm(false);
};









const fetchMedicalRecord = async (web5: Web5, did: any) => {
 const response = await web5.dwn.records.query({
   from: did,
   message: {
     filter: {
       protocol: "https://medibank.dev/medical-records-protocol",
       schema: "https://medibank.dev/medicalRecord",
       dataFormat: 'application/json',
     },
     //sorting the records 
     //dateSort: 'createdAscending',
   },
 });


 console.log("Response", response)


 if (response.records && response.status.code === 200) {
   const receivedRecords = await Promise.all(
     response.records.map(async (record) => {
       const data = await record.data.json();
       console.log("Medical Record 1: ", data)
       return data;
     })
   );


   console.log("Records:", receivedRecords);
  
   return receivedRecords;
 } else {
   console.log("error:", response.status);
 }
};


const handleAddRecordClick = () => {
  setShowForm(true);
};

 return (
  
   <div className="flex flex-col min-h-screen bg-gray-100">
     <div>
     {showForm && (
     <Card>
     <CardHeader>
       <CardTitle>Patient Visit Information</CardTitle>
       <CardDescription>Please fill out this form regarding your recent medical visit.</CardDescription>
     </CardHeader>
     <CardContent>
       <form onSubmit={(e) => handleSubmit(e)}>
           <div className="flex flex-col">
             <label className="sr-only" htmlFor="doctor">
               Doctor
             </label>
             <input
               type="text"
               className="block w-full rounded-md bg-white border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 placeholder-gray-500 my-2 text-gray-900"
               name="doctor"
               placeholder="Name of Doctor"
               id="doctor"
               value={doctor}
               onChange={(e) => setDoctor(e.target.value)}
               required
             />
           </div>
           <div className="flex flex-col">
             <label htmlFor="keywords" className="sr-only">
               Summary
             </label>
             <textarea
               rows={3}
               value={summary}
               onChange={(e) => setSummary(e.target.value)}
               name="keyWords"
               id="keyWords"
               placeholder="Summary of visit"
               className="block w-full rounded-md bg-white border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 placeholder-gray-500 my-2 text-gray-900"
             />
           </div>
           <div className="flex flex-col">
             <label className="sr-only" htmlFor="reason">
               Reason For Visit
             </label>
             <select
               value={reason}
               onChange={(e) => setReason(e.target.value)}
               className="block w-full rounded-md bg-white border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 placeholder-gray-500 my-2 text-gray-900"
               name="reason"
               id="reason"
             >
               <option value="default">Select Reason (Optional)</option>
               <option value="General">General</option>
               <option value="Eye">Eye</option>
               <option value="Dental">Dental</option>
               <option value="Other">Other</option>
             </select>
           </div>


           <button
             className={`bg-blue-600 w-full hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded
               ${
                 isSaving || doctor === ""
                   ? "cursor-not-allowed opacity-50"
                   : ""
               }`}
             type="submit"
             disabled={isSaving || doctor === ""}
           >
             {isSaving ? "Saving to DWN..." : "Save to DWN"}
           </button>
         </form>
     </CardContent>
   </Card>
   )}
     </div>
     {!showForm && (
      <div>
     <Records records={allRecords} />
          <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              onClick={handleAddRecordClick}>
              Add Record +
            </button>
        </div>
     )}
   </div>

 )
}



function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
 return (
   <svg
     {...props}
     xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
   >
     <polyline points="20 6 9 17 4 12" />
   </svg>
 )
}
