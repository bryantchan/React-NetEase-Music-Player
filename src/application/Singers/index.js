import React, { useState, useEffect } from "react";
import Horizen from "../../baseUI/horizen-item";
import { categoryTypes, alphaTypes } from "../../api/config";
import { NavContainer, ListContainer, List, ListItem } from "./style";
import Scroll from "../../baseUI/scroll";
import * as actionCreators from "./store/actionCreators";
import { connect } from "react-redux";
import { toJS } from "immutable";
import Loading from "../../baseUI/loading";

function Singers(props) {
  let [category, setCategory] = useState("");
  let [alpha, setAlpha] = useState("");

  let handleUpdateAlpha = val => {
    setAlpha(val);
    updateDispatch(category, val);
  };

  let handleUpdateCategory = val => {
    setCategory(val);
    updateDispatch(val, alpha);
  };

  const {
    singerList,
    pageCount,
    enterLoading,
    pullUpLoading,
    pullDownLoading
  } = props;

  const {
    updateDispatch,
    getHotSingerDispatch,
    pullUprefreshDispatch,
    pullDownRefreshDispatch
  } = props;

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch();
    }
  }, []);

  const handlePullUp = () => {
    pullUprefreshDispatch(category, alpha, category === "", pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  const singerListJS = singerList ? singerList.toJS() : [];

  const renderSingerList = () => {
    return (
      <List>
        {singerListJS.map((item, index) => {
          return (
            <ListItem key={item.accountId + "" + index}>
              <div className="img_wrapper">
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={"分类（默认热门）："}
          handleClick={val => handleUpdateCategory(val)}
          oldVal={category}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title={"首字母："}
          handleClick={val => handleUpdateAlpha(val)}
          oldVal={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        {enterLoading ? <Loading></Loading> : null}
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
    </div>
  );
}

const mapStateToProps = state => ({
  singerList: state.getIn(["singers", "singerList"]),
  enterLoading: state.getIn(["singers", "enterLoading"]),
  pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
  pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
  pageCount: state.getIn(["singers", "pageCount"])
});

const mapDispatchToProps = dispatch => {
  return {
    getHotSingerDispatch() {
      dispatch(actionCreators.getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(actionCreators.changePageCount(0));
      dispatch(actionCreators.changeEnterLoading(true));
      dispatch(actionCreators.getSingerList(category, alpha));
    },
    pullUprefreshDispatch(category, alpha, hot, count) {
      dispatch(actionCreators.changePullUpLoading(true));
      dispatch(actionCreators.changePageCount(count + 1));
      if (hot) {
        dispatch(actionCreators.refreshMoreHotSingerList());
      } else {
        dispatch(actionCreators.refreshMoreSingerList(category, alpha));
      }
    },
    pullDownRefreshDispatch(category, alpha) {
      dispatch(actionCreators.changePullDownLoading(true));
      dispatch(actionCreators.changePageCount(0));
      if (category === "" && alpha === "") {
        dispatch(actionCreators.getHotSingerList());
      } else {
        dispatch(actionCreators.getSingerList(category, alpha));
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singers));
