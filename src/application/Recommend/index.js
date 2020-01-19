import React, { useEffect } from "react";
import Slider from "../../components/slider";
import RecommendList from "../../components/list";
import Scroll from "../../components/scroll";
import { Content } from "./style";
import { connect } from "react-redux";
import * as actionTypes from "./store/actionCreators";
import { getRecommendListRequest } from "../../api/request";

function Recommend(props) {
  const { bannerList, recommendList } = props;
  const { getBannerDataDispatch, getRecommendListDataDipatch } = props;

  useEffect(() => {
    getBannerDataDispatch();
    getRecommendListDataDipatch();
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  return (
    <Content>
      <Scroll className="list">
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
    </Content>
  );
}

const mapStateToProps = state => ({
  bannerList: state.getIn(["recommend", "bannerList"]),
  recommendList: state.getIn(["recommend", "recommendList"])
});

const mapDispatchToProps = dispatch => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDipatch() {
      dispatch(actionTypes.getRecomendList());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend));
