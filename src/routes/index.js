import React from "react";
import { Redirect } from "react-router-dom";
import Home from "../application/Home/index";
import Recommand from "../application/Recommand/index";
import Singers from "../application/Singers/index";
import Rank from "../application/Rank/index";

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/recommand"} />
      },
      {
        path: "/recommand",
        component: Recommand
      },
      {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank",
        component: Rank
      }
    ]
  }
];
