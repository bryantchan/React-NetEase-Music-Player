import {
  getHotSingerListRequest,
  getSingerListRequest
} from "../../../api/request";

import * as actionTypes from "./constants";

import { fromJS } from "immutable";

const changeSingerList = data => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
});

export const changePageCount = data => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data
});

export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
});

export const changePullUpLoading = data => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
});

export const changePullDownLoading = data => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data
});

export const getHotSingerList = () => {
  return dispatch => {
    getHotSingerListRequest(0)
      .then(res => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log("failed to get singer data");
      });
  };
};

export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => [
    getSingerListRequest(category, alpha, 0)
      .then(res => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log("failed to get singer data");
      })
  ];
};

export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(["singers", "pageCount"]);
    const singerList = getState()
      .getIn(["singers", "singerList"])
      .toJS();
    getSingerListRequest(category, alpha, pageCount)
      .then(res => {
        const data = [...singerList, ...res.artists];
        dispatch(changeSingerList(data));
        dispatch(changePullUpLoading(false));
      })
      .catch(() => {
        console.log("failed to get singer data");
      });
  };
};
