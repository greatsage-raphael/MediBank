import Link from "next/link"
import { SVGProps } from "react"

export default function Navbar() {
    return (
        <header className="flex items-center h-16 px-4 border-b bg-white">
        <h1 className="ml-2 text-2xl font-semibold">Open Academy</h1>
        <nav className="ml-auto font-medium">
          <Link className="mx-2 text-gray-500 hover:text-gray-900" href="/">
            Home
          </Link>
          <Link className="mx-2 text-gray-500 hover:text-gray-900" href="./profile">
            Profile
          </Link>
          <Link className="mx-2 text-gray-500 hover:text-gray-900" href="./records">
            Records
          </Link>
        </nav>
      </header>
    )
  }