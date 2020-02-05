//src/application/Album/index.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { Container, TopDesc, Menu, SongList, SongItem } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import { getCount, getName, isEmptyObject } from "../../api/utils";
import style from "../../assets/global-style";
import Loading from "../../baseUI/loading";
import * as actions from "./store/actionCreators";

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("playlist");
  const [isMarquee, setIsMarquee] = useState(false);

  // 从路由中拿到歌单的 id
  const id = props.match.params.id;

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  // 同时将 mock 数据的代码删除
  let currentAlbum = currentAlbumImmutable.toJS();

  const headerEl = useRef();
  const HEADER_HEIGHT = 45;

  const handleScroll = pos => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y / minScrollY);
    let headerDom = headerEl.current;
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbum.name);
      setIsMarquee(true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("playlist");
      setIsMarquee(false);
    }
  };

  const handleBack = () => {
    setShowStatus(false);
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        {enterLoading ? <Loading></Loading> : null}
        <Header
          title="Back"
          handleClick={handleBack}
          ref={headerEl}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                  <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  <img src={currentAlbum.coverImgUrl} alt="" />
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">
                      {Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万
                    </span>
                  </div>
                </div>
                <div className="desc_wrapper">
                  <div className="title">{currentAlbum.name}</div>
                  <div className="person">
                    <div className="avatar">
                      <img src={currentAlbum.creator.avatarUrl} alt="" />
                    </div>
                    <div className="name">{currentAlbum.creator.nickname}</div>
                  </div>
                </div>
              </TopDesc>
              <Menu>
                <div>
                  <i className="iconfont">&#xe6ad;</i>
                  评论
                </div>
                <div>
                  <i className="iconfont">&#xe86f;</i>
                  点赞
                </div>
                <div>
                  <i className="iconfont">&#xe62d;</i>
                  收藏
                </div>
                <div>
                  <i className="iconfont">&#xe606;</i>
                  更多
                </div>
              </Menu>
              <SongList>
                <div className="first_line">
                  <div className="play_all">
                    <i className="iconfont">&#xe6e3;</i>
                    <span>
                      {" "}
                      播放全部{" "}
                      <span className="sum">
                        (共 {currentAlbum.tracks.length} 首)
                      </span>
                    </span>
                  </div>
                  <div className="add_list">
                    <i className="iconfont">&#xe62d;</i>
                    <span>
                      {" "}
                      收藏 ({getCount(currentAlbum.subscribedCount)})
                    </span>
                  </div>
                </div>
                <SongItem>
                  {currentAlbum.tracks.map((item, index) => {
                    return (
                      <li key={index}>
                        <span className="index">{index + 1}</span>
                        <div className="info">
                          <span>{item.name}</span>
                          <span>
                            {getName(item.ar)} - {item.al.name}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </SongItem>
              </SongList>
            </div>
          </Scroll>
        ) : null}
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(["album", "currentAlbum"]),
  enterLoading: state.getIn(["album", "enterLoading"])
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(actions.changeEnterLoading(true));
      dispatch(actions.getAlbumList(id));
    }
  };
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
