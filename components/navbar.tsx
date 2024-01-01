import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { SVGProps } from "react"

export default function Navbar() {
  
  return (
      <header className="flex items-center h-16 px-4 border-b bg-white">
        <StethoscopeIcon className="h-6 w-6" />
      <h1 className="ml-2 text-2xl font-semibold">MediBank</h1>
      <nav className="ml-auto font-medium">
      <div className="flex items-center gap-3 mb-4 mx-2">
          <Avatar className="h-9 w-9">
            <AvatarImage alt="User Avatar" src="https://robohash.org/avatar.png" />
          </Avatar>
          <div className="grid gap-0.5 text-xs"> 
          </div>
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
  