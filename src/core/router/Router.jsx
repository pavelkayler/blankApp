import { createBrowserRouter } from "react-router-dom";
import MainPage from "../../ui/pages/MainPage.jsx";

const routes = [
  {
    path: "/",
    element: <MainPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
