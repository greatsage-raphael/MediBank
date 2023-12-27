import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
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
}: {
  showDemoModal: boolean;
  setShowDemoModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
      <div className="flex flex-col min-h-screen bg-gray-100">
     <div>
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
     </div>
   </div>

    </Modal>
  );
};

export function useModal() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const DemoModalCallback = useCallback(() => {
    return (
      <DemoModal
        showDemoModal={showDemoModal}
        setShowDemoModal={setShowDemoModal}
      />
    );
  }, [showDemoModal, setShowDemoModal]);

  return useMemo(
    () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
    [setShowDemoModal, DemoModalCallback],
  );
}