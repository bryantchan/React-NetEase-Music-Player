import React from "react";
import { renderRoutes } from "react-router-config";
import { Top, Tab, TabItem } from "./style";
import { NavLink } from "react-router-dom"; //利用NavLink组件进行路由跳转
import Player from "../Player";

function Home(props) {
  const { route } = props;

  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title"></span>
        <span
          className="iconfont search"
          onClick={() => props.history.push("/search")}
        >
          &#xe62b;
        </span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected">
          <TabItem>
            <span>HOT</span>
          </TabItem>
        </NavLink>
        <NavLink to="/singers" activeClassName="selected">
          <TabItem>
            <span>SINGER</span>
          </TabItem>
        </NavLink>
        <NavLink to="/rank" activeClassName="selected">
          <TabItem>
            <span>RANK</span>
          </TabItem>
        </NavLink>
      </Tab>
      {renderRoutes(route.routes)}
      <Player></Player>
    </div>
  );
}

export default React.memo(Home);
