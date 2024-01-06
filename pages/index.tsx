import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "../components/card"
import {  Web5 } from "@web5/api";
import { useState, useEffect, SVGProps, ChangeEvent } from "react";
import { useRouter } from 'next/router'
import Records from "../components/records";
import Navbar from "../components/navbar";
import imageCompression  from "browser-image-compression"
import { Button } from "../components/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Badge } from "../components/badge";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/accordion";


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
 const [appointment, setAppointment] = useState<string >("")
 const [medicalImage, setMedicalImage] = useState<File | null>(null);

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
        "dataFormats": ["application/json"]
      },
      "medicalImage": {
         "dataFormats": ["image/png", "image/jpeg"]
      }
    },
    "structure": {
      "medicalRecord": 
     {
        "$actions": [
          {
            "who": "anyone",
            "can": "write"
          },
          {
            "who": "author",
            "of": "medicalRecord",
            "can": "read"
          },
          {
           "who": "recipient",
           "of": "medicalRecord",
           "can": "write"
         },
         {
           "who": "recipient",
           "of": "medicalRecord",
           "can": "read"
         }
        ],
        "medicalImage": {
         "$actions": [
           {
             "who": "author",
             "of": "medicalRecord",
             "can": "write"
           },
           {
             "who": "author",
             "of": "medicalRecord",
             "can": "read"
           },
           {
             "who": "recipient",
             "of": "medicalRecord",
             "can": "write"
           }
         ]
       }
     }
    }
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


  //console.log("Local Protocol:", installProtocolLocally)




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
   //console.log( "Local Protocol", localProtocol[0] );
   //console.log("LocalProtocolStatus:", localProtocolStatus)
  
   if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
       const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
       //console.log("Protocol installed locally", protocol, status);


       // Check if 'protocol' is not undefined before using it
       if (protocol) {
           const { status: configureRemoteStatus } = await protocol.send(did);
           //console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
       } else {
           //console.error("Protocol is undefined after installation");
       }
   } else {
       console.log("Protocol already installed");
   }
};


const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {

  const options = {
    maxSizeMB: 0.6,
    useWebWorker: true
  };

  const originalImage = e.target.files ? e.target.files[0] : null;

  if(originalImage){
  // compress the original image
  
  let compressedImage;
  imageCompression(originalImage, options).then(image => {
    compressedImage = image
    
    console.log("original", originalImage)
    console.log("Image: ",image)
    

    const downloadLink = URL.createObjectURL(image);

    console.log(downloadLink)

    let diff = originalImage.size - image.size 


    setMedicalImage(compressedImage);

    //console.log("DownloadLink: ",downloadLink)
    //setCompressedLink(downloadLink);
  });
}
};

//making the medical Record
const constructMedicalRecord = (summary: string, doctor: string, reason: string, appointment:string) => {
 const currentDate = new Date().toLocaleDateString();
 const currentTime = new Date().toLocaleTimeString();
 const medicalRecord = {
   author: myDid,
   summary: summary,
   doctor: doctor,
   reason: reason,
   appointment: appointment,
   dateAdded: `${currentDate}`,
   time: `${currentTime}`
 };
 console.log("Medicalrecord:", medicalRecord)
 return medicalRecord;
};

async function imageWrite(imageDataFile: File, contextId: string) {
  const imageblob = new Blob([imageDataFile], { type: 'image/jpeg' });

  if(web5){
    console.log("Begin")
  const { record } = await web5.dwn.records.create({
    data: imageblob,
    store: false,
    message: {
      schema: "https://medibank.dev/medicalRecord",
      dataFormat: 'image/jpeg',
      protocol: 'https://medibank.dev/medical-records-protocol',
      protocolPath: 'medicalRecord/medicalImage',
      parentId: contextId,
      contextId: contextId,
      published: false,
    },
  });
  if (record){
    console.log("Begin 2")
  const { status: imagestatus } = await record.send(myDid);
  console.log("ImageStaus: ", imagestatus);
  }
}
}




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
   if(record){
    const {status} = await record.send(myDid);
   }

   console.log("Medical Img: ", medicalImage)
   if(medicalImage && record){
    const RecordId = record.id
    await imageWrite(medicalImage, RecordId)
   }
   return record;
 } else {
   // Handle the case where web5 is null
   console.error("web5 is null or undefined");
 }

};




const handleSubmit = async (e: any) => {
 e.preventDefault();
 setIsSaving(true)
 console.log("summary",summary)
 console.log("doctor", doctor)
 console.log("reason", reason)
 console.log("All saved Records", allRecords)
 const medicalRecord = constructMedicalRecord(summary, doctor, reason, appointment);
 const JSONmedicalRecord = JSON.stringify(medicalRecord)
 const record = await writeToDwn(JSONmedicalRecord);
 //console.log("Logged record", record)
 setIsSaving(false)
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
   },
 });

 //get images
 const { records } = await web5.dwn.records.query({
  from: did,
  message: {
    filter: {
      protocol: "https://medibank.dev/medical-records-protocol",
      protocolPath: 'medicalRecord/medicalImage',
    },
  },
});
//console.log('image records :', records); 

const MedicalRecordsIds: any[] = []
 
if (response.records && response.status.code === 200) {
  const receivedRecords = await Promise.all(
    response.records.map(async (record) => {
      let data = await record.data.json();
      const medicalRecordId = record.id;
      MedicalRecordsIds.push(medicalRecordId);

      if (records) {
        for (const imageRecord of records) {
          //console.log('Image Record:', imageRecord);

          const imageId = imageRecord.id
          //console.log("Image ID :", imageId)
          
          // Retrieve blob data for the image record
          const { record, status } = await web5.dwn.records.read({
            from: did,
            message: {
              filter: {
                recordId: imageId,
              },
            },
          });

          const parentId = imageRecord.contextId

          if(parentId === medicalRecordId) {
          
          const imageresult = await record.data.blob()
          const imageUrl = URL.createObjectURL(imageresult);
          data.image = imageUrl
          data.id = medicalRecordId
          data.imageId = imageId
          
          const completedMedicalrecords = data;
          //console.log('new data:', completedMedicalrecords);
          data = completedMedicalrecords
          }
        }
      }
      // Return 'data' which now holds 'completedMedicalrecords'.
      return data
    })
  );
  
  //console.log("ReceivedRecords: ", receivedRecords)
  return receivedRecords;
} else {
  console.log("Error:", response.status);
}
};


const handleAddRecordClick = () => {
  setShowForm(true);
};




 return (
   <div className="flex flex-col min-h-screen bg-gray-100">
    <Navbar did={myDid}/>
     <div>
     {showForm && (
     <Card>
     <CardHeader>
       <CardTitle>Patient Visit Information</CardTitle>
       <CardDescription>Please fill out this form regarding your recent medical visit.</CardDescription>
     </CardHeader>
     <CardContent>
       <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mx-auto w-1/2" >
       <div className="flex flex-col">
             <label className="sr-only" htmlFor="reason">
               Reason For Visit
             </label>
             <select
               value={reason}
               onChange={(e) => setReason(e.target.value)}
               className="w-full bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
               name="reason"
               id="reason">
               <option value="default">Select Reason</option>
               <option value="General">General Checkup</option>
               <option value="Emergency Room Visits 🚨">Emergency Room Visits 🚨</option>
               <option value="Optician 👓">Optician (glasses)  👓</option>
               <option value="Dental 🦷">Dental (teeth) 🦷</option>
               <option value="Orthopedics 🦴">Orthopedics (Bones) 🦴</option>
               <option value="Cardiology 🫀">Cardiology (heart) 🫀</option>
               <option value="Neurology 🧠">Neurology (Brain, Spinal)🧠</option>
               <option value="Dermatology">Dermatology (Skin)</option>
               <option value="Gastroenterology 🪱">Gastroenterology (Digestive track)🪱</option>
               <option value="Obstetrics and Gynecology 🤰">Obstetrics and Gynecology 🤰</option>
               <option value="Endocrinology 🧪">Endocrinology 🧪</option>
               <option value="Pulmonology 🫁">Pulmonology🫁</option>
               <option value="Ophthalmology 👁">Ophthalmology 👁</option>
             </select>
           </div>

           

           <div className="flex flex-col">
             <label className="sr-only" htmlFor="doctor">
               Doctor 👨🏿‍⚕️
             </label>
             <input
               type="text"
               className="w-full bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
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
             <label className="sr-only" htmlFor="doctor">
               MedicalImage
             </label>
             <input
               type="file"
               className="w-60 bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
               name=""
               placeholder="Medical Image"
               id="medicalImage"
               accept="image/*"
               onChange={handleFileChange}
               required
             />
          </div>

           
          <div className="flex flex-col">
             <label className="sr-only" htmlFor="doctor">
               Date
             </label>
             <input
               type="date"
               className="w-40 bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
               name=""
               placeholder="Date of Next Appointment"
               id="appointment"
               value={appointment}
               onChange={(e) => setAppointment(e.target.value)}
               required
             />
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
        
            

            <Button variant="black" size="lg" onClick={handleAddRecordClick}>
            Add Record +
            </Button>
            <Accordion className="w-full" collapsible type="single">
          <AccordionItem value="personal">
            <AccordionTrigger className="text-base">Personal Records</AccordionTrigger>
            <AccordionContent>
     {web5 !== null && <Records records={allRecords} web5={web5} did={myDid}/>}
     </AccordionContent>
          </AccordionItem>
          <AccordionItem value="received">
            <AccordionTrigger className="text-base">Received Records</AccordionTrigger>
            <AccordionContent>
            {web5 !== null && <Records records={allRecords} web5={web5} did={myDid}/>}
            </AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>
    
     )}
   </div>

 )
}
