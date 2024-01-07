import Footer from './footer'
import { Toaster } from "../components/toaster"

interface MyComponentProps {
    children: React.ReactNode;
  }
 
  const Layout: React.FC<MyComponentProps> = ({ children }) => {  
  return (
    <>
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  )
}


export default Layout;