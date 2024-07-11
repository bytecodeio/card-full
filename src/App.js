import React from "react";
import { ExtensionProvider, ExtensionContext } from "@looker/extension-sdk-react";
import { hot } from "react-hot-loader/root";
import { Main2 } from "./Main2";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { APP_ROUTE } from "./utils/constants2";
import { AdminPage } from "./components/Admin";
import { PrintPage } from "./components/PrintPage"
import { useContext } from "react";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { InitialPage } from "./InitialPage";

export const App = hot(() => {

  const isLandingPage = () => {
    const extensionContext = useContext(ExtensionContext)
    
  }
  return (
    <ExtensionProvider chattyTimeout={100000000}>
      <Switch>
        {/*Route for Print page for exporting a visualization*/}
        <Route exact path='/print'>
          <PrintPage />
        </Route>
        {/*Route for Admin page for updating the context data*/}
        <Route exact path='/admin'>
          <AdminPage />
        </Route>
        <Route path='/:path/'>
          <Main2 />
        </Route>
        {/*Route for InitialPage page which decides whether to go to Main2 or Landing Page*/}
        <Route exact path="/">
          <InitialPage />
        </Route>
        {/* <Redirect push from="/" to={APP_ROUTE} /> */}
      </Switch>
    </ExtensionProvider>
  );
});
