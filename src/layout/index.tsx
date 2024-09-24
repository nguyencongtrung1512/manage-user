import { Outlet } from "react-router-dom"
import Header from "../component/header"



function Layout() {
  return (
    <>
    <Header/>
{/*nội dung chính của page */}
    <Outlet/>
    </>
  )
}

export default Layout