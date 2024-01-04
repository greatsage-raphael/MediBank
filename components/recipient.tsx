import { Web5 } from "@web5/api";
import Modal from "./modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";


const DemoModal = ({
  showDemoModal,
  setShowDemoModal,
  web5,
  recordId
}: {
  showDemoModal: boolean;
  setShowDemoModal: Dispatch<SetStateAction<boolean>>;
  web5: Web5
  recordId: string
}) => {

  const [recipientid, setRecipient] = useState<string >("")
  const [isSending, setIsSending] = useState(false)

  console.log("recipientID ",recipientid)

  
  

  const SendRecord = async (recordID: string) => {
    setIsSending(true)
    console.log('Sending', recordId);
    if (!web5) {
      console.error("Web5 or did is missing");
      return;
    }

    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    //console.log("Record to be sent", response.records)

    if(response.records){
    const message = response.records.map(async (recordSent) => {
      let data = await recordSent.data.json();
      const JSONdata = JSON.stringify(data)

      console.log("Record Sent", data)
      console.log("Record JSON Sent", JSONdata)

      const { record } = await web5.dwn.records.create({
        data: JSONdata,
        store: false, //remove this line if you want to keep a copy of the record in the sender's DWN
        message: {
            dataFormat: 'application/json'
        },
    });

    console.log("Record Formed", record)

    //send record to recipient's DWN
  if(record){
    const {status} = await record.send(recipientid);
    console.log("Status: ", status)
    if (status.code === 200){
      console.log(`Record ${record} sent successfully`)
    }
    }
    })
  
  }
}

  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    SendRecord(recordId)
   };

  return (
    <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
      <button className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
        <form onSubmit={(e) => handleSubmit(e)} >
        <input
               type="text"
               className="w-full bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
               name="recipient"
               placeholder="DID of Doctor"
               id="recipient"
               value={recipientid}
               onChange={(e) => setRecipient(e.target.value)}
               required
             />

<button
             className={`bg-blue-600 w-full hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded
               ${
                 isSending || recipientid === ""
                   ? "cursor-not-allowed opacity-50"
                   : ""
               }`}
             type="submit"
             disabled={recipientid === ""}
           >
             {isSending ? "Sending to Doctor..." : "Send to doctor"}
           </button>
          </form>
        </div>
      </button>
    </Modal>
  );
};

export function useModal() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const DemoModalCallback = useCallback((web5: Web5, recordId: string) => {
    return (
      <DemoModal
        showDemoModal={showDemoModal}
        setShowDemoModal={setShowDemoModal}
        web5={web5}
        recordId={recordId}
      />
    );
  }, [showDemoModal, setShowDemoModal]);

  return useMemo(
    () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
    [setShowDemoModal, DemoModalCallback],
  );
}