import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { SVGProps } from "react"
import copy from 'clipboard-copy';
import { Button } from "./button";

interface didProps {
  did: string;
}

const Navbar: React.FC<didProps> = ({ did }) => {

  //Robohash is a easy web service that makes it easy to provide unique, robot/alien/monster/whatever images for any text
    const roboHashName = `https://robohash.org/${did}`


    const handleClick = async () => {
      const string = `${did}`    
       await copy(string)
    }

  return (
      <header className="flex items-center h-16 px-4 border-b bg-white">
        <StethoscopeIcon className="h-6 w-6" />
      <h1 className="ml-2 text-2xl font-semibold">MediBank</h1>
      <nav className="ml-auto font-medium">
      <div className="flex items-center gap-3 mb-4 mx-2">
      <Button className="rounded-full" size="icon" variant="outline" onClick={handleClick}>
            <Avatar className="h-9 w-9 rounded-full cursor-pointer">
              <AvatarImage alt="User Avatar" src={roboHashName} />
              <AvatarFallback>{did}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </nav>
    </header>
  )
}

function StethoscopeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    )
}

export default Navbar;