//typescrip = javascript + datatypes

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import Home from "./page/home";
import Details from "./page/detail";
import AddUser from "./page/add";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/detail/:id",
          element: <Details/>
        },
        {
          path: "/add",
          element: <AddUser/>
        }
       
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}



export default App