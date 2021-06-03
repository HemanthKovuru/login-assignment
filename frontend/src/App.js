import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/profile' component={Profile} />
      </Switch>
    </>
  );
};

export default App;
