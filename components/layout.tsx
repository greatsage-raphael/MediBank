import Navbar from './navbar'
import Footer from './footer'

interface MyComponentProps {
    children: React.ReactNode;
  }
 
  const Layout: React.FC<MyComponentProps> = ({ children }) => {  
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  )
}


export default Layout;