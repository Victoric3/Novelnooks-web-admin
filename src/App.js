import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import PrivateRoute from "./components/Routing/PrivateRoute";
import LoginScreen from "./components/AuthScreens/LoginScreen";
import ConfirmEmailAndSignUp from "./components/AuthScreens/confirmEmailAndSignUp";
import NotFound from "./components/GeneralScreens/NotFound";
import EditStory from "./components/StoryScreens/EditStory";
import configData from "./config.json";
import HeaderStory from "./components/GeneralScreens/headerStory";
import AuthorBooksScreen from "./components/GeneralScreens/authorBook";
import AddBookEditor from "./components/StoryScreens/AddStory";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginScreen />} />
          <Route
            exact
            path="/confirmEmailAndSignUp"
            element={<ConfirmEmailAndSignUp />}
          />
              <Route path="/" element={<LayoutsWithHeaderStory />}>
            <Route path="*" element={<NotFound />} />
                  <Route exact path="/addstory" element={<PrivateRoute />}>
                    <Route exact path="/addstory" element={<AddBookEditor />} />
                  </Route>
                  <Route exact path="/editstory" element={<PrivateRoute />}>
                    <Route exact path="/editstory" element={<AuthorBooksScreen />} />
                  </Route>
                  <Route exact path="/story/:slug/edit" element={<PrivateRoute />}>
                    <Route exact path="/story/:slug/edit" element={<EditStory />} />
                  </Route>
                 
                </Route>
        </Routes>
      </div>
    </Router>
  );
};

// const LayoutsWithHeader = () => {
//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "100vh",
//           justifyContent: "space-between",
//           backgroundColor: configData.background,
//         }}
//       >
//         <div>
//           <Header />
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

const LayoutsWithHeaderStory = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "space-between",
          backgroundColor: configData.background,
        }}
      >
        <div>
          <HeaderStory />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
