import * as actionTypes from "./constants";
import { fromJS } from "immutable";
import {
  getBannerRequest,
  getRecommendListRequest
} from "../../../api/request";

export const changeBannerList = data => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
});

export const changeRecommendList = data => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
});

export const getBannerList = () => {
  return dispatch => {
    getBannerRequest()
      .then(data => {
        dispatch(changeBannerList(data.banners));
      })
      .catch(() => {
        console.log("banner data error");
      });
  };
};

export const getRecomendList = () => {
  return dispatch => {
    getRecommendListRequest()
      .then(data => {
        dispatch(changeRecommendList(data.result));
      })
      .catch(() => {
        console.log("recommend data error");
      });
  };
};
