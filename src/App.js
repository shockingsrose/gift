import React, { Component } from 'react';
import Cookies from 'js-cookie';
import throttle from './utils/throttle';
import Modal from './component/Modal';
import Register from './component/register';
import TransferModal from './component/transfer';
import Cart from './component/cart';
import Login from './component/login';
import './App.css';
import './grid.css';
import apiUser from './api/user';
import apiGood from './api/good';
import apiCategory from './api/category';

const inititalQuery = () => ({
  categoryId: '',
  pageNum: 1,
  pageSize: 12
});
class App extends Component {
  constructor() {
    super();
    this.state = {
      categoryList: [],
      list: [],
      pageBottom: false,
      pageTotal: 0,
      // header的margin-bottom的值（tagDiv切换position时改变）
      marginBottom: 0,
      query: inititalQuery(),
      modal_login: {
        show: false
      },
      modal_register: {
        show: false
      },
      // 转账
      modal_transfer: {
        show: false,
        code: '',
        data: {}
      },
      loginStatus: false,
      loginError: '',
      userInfo: {
        account: '',
        id: '',
        token: ''
      },
      cartShow: false,
      scrollWidth: 0
    };
  }

  componentDidMount() {
    this.checkAuth();
    this.getCategoryList();
    this.TagScrollEvent();
    this.getListByScroll();
  }

  checkAuth() {
    const account = Cookies.get('account');
    const userId = Cookies.get('userId');
    const token = Cookies.get('token');
    if (token) {
      this.setState({ loginStatus: true, userInfo: { account, id: userId, token } });
    }
  }

  // 标签条滚动
  TagScrollEvent() {
    const tagDiv = document.getElementById('tagDiv');
    tagDiv.addEventListener('mousewheel', (e) => {
      e.preventDefault();
      let { scrollWidth } = this.state;
      const tagContainer = document.querySelector('#tagDiv .container');
      const tagContainerStyle = window.getComputedStyle(tagContainer);
      // 可视tag宽度
      const tagContainerWidth = tagContainerStyle['width'].split('px')[0];
      // tag总宽度
      const tagScrollWidth = this.state.categoryList.length * 140;
      // 最多位移大小
      const limitWidth = tagScrollWidth - tagContainerWidth;
      // 每次滚动移动的值
      const scrollValue = 60;

      if (tagScrollWidth < tagContainerWidth) {
        return;
      }

      //向下滚动
      if (e.wheelDelta > 0) {
        scrollWidth = scrollWidth - scrollValue > -limitWidth ? scrollWidth - scrollValue : -limitWidth;
      } else {
        scrollWidth = scrollWidth + scrollValue < 0 ? scrollWidth + scrollValue : 0;
      }
      this.setState({ scrollWidth });
    });
  }

  // 无限滚动
  getListByScroll = () => {
    document.body.addEventListener(
      'mousewheel',
      throttle(() => {
        if (this.state.pageBottom) {
          return;
        }
        const bodyHeight = document.body.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollHeight = window.scrollY;

        if (bodyHeight - (scrollHeight + windowHeight) <= 50) {
          this.setState(
            {
              query: Object.assign(this.state.query, { pageNum: this.state.query.pageNum + 1 })
            },
            () => {
              console.log('getlist');
              this.getList();
            }
          );
        }
      }, 1000)
    );
  };

  getList(data = this.state.query) {
    apiGood.getList(data).then(({ list, isLastPage }) => {
      this.setState({ list: [...this.state.list, ...list], pageBottom: isLastPage });
    });
  }

  getCategoryList() {
    apiCategory.getList().then(({ list }) => {
      this.setState({ categoryList: list });
      // 通过获取到的category 获取list
      const categoryId = list.length > 0 ? list[0].id : 0;
      this.setState({ query: Object.assign(this.state.query, { categoryId }) }, () => {
        this.getList(this.state.query);
      });
    });
  }

  toggleTag = (id) => {
    this.setState({ query: Object.assign(this.state.query, { categoryId: id, pageNum: 1 }), list: [] }, () => {
      this.getList();
    });
  };

  handlePageChange = ({ selected }) => {
    this.setState({ query: Object.assign(this.state.query, { pageNum: selected + 1 }) }, () => {
      this.getList();
    });
  };

  showModal = (modalName, data = {}) => {
    let modalData = this.state[modalName];
    modalData = Object.assign(modalData, data, { show: true });
    this.setState({ [modalName]: modalData });
  };

  closeModal = (modalName, data = {}) => {
    let modalData = this.state[modalName];
    modalData = Object.assign(modalData, data, { show: false });
    this.setState({ [modalName]: modalData });
  };

  login = (account, password) => {
    // 调用接口
    apiUser
      .login({ account, password })
      .then(({ id, token }) => {
        this.closeModal('modal_login');
        this.closeModal('modal_register');
        this.toggleLoginStatus(true);
        this.refs.login.clear();
        const userInfo = Object.assign(this.state.userInfo, { account, id, token });
        this.setState({ userInfo });

        Cookies.set('account', account, { expires: 7 });
        Cookies.set('userId', id, { expires: 7 });
        Cookies.set('token', token, { expires: 7 });
      })
      .catch(() => {
        this.setState({ loginError: '账号或密码错误' });
      });
  };

  register = (account, password, code) => {
    // 调用接口
    apiUser
      .register({ account, password, code })
      .then(() => {
        this.refs.register.success();
        setTimeout(() => {
          this.closeModal('modal_register');
          this.showModal('modal_login');
        }, 2000);
      })
      .catch(({ message }) => {
        this.refs.register.setState({ error: message });
      });
  };

  loginOut = () => {
    this.setState({ loginStatus: false, userInfo: {} });
    Cookies.remove('account');
    Cookies.remove('userId');
    Cookies.remove('token');
  };

  toggleLoginStatus = (status) => {
    this.setState({ loginStatus: status });
  };

  toLogin = () => {
    this.closeModal('modal_register');
    this.showModal('modal_login');
  };
  toRegister = () => {
    this.closeModal('modal_login');
    this.showModal('modal_register');
  };

  toggleCartShow = (show) => {
    this.setState({ cartShow: show });
  };
  render() {
    const { marginBottom, loginStatus, loginError, userInfo } = this.state;
    const { modal_login, modal_register, cartShow, modal_transfer } = this.state;
    const { toggleCartShow } = this;
    const navigate = (href) => {
      window.open(href);
    };
    return (
      <div className="App">
        <header className="App-header" style={{ marginBottom }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="App-logo">LOGO</div>
              </div>
              <div className="col-sm-6">
                <div className="text-right">
                  <div className="App-login-text">
                    <LoginStatus
                      loginStatus={loginStatus}
                      showModal={this.showModal}
                      userInfo={this.state.userInfo}
                      loginOut={this.loginOut}
                      toggleCartShow={toggleCartShow}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* cart */}
        {loginStatus ? (
          <div className="cart-box">
            <div
              className="App-cart pointer"
              onClick={() => {
                toggleCartShow(true);
              }}
            >
              <div className="ptb-10">
                <i className="iconfont icon-xiangzuo color-fff" style={{ transform: 'rotate(180deg)' }} />
              </div>
              <div className="ptb-10">
                {/* <img src={userSrc} alt="" /> */}
                <i className="iconfont icon-iconfonticon5" />
              </div>
            </div>
            <Cart
              ref="cart"
              show={cartShow}
              showModal={() => {
                this.showModal('modal_transfer');
              }}
              handleClose={() => {
                this.toggleCartShow(false);
              }}
              loginStatus={loginStatus}
            />
          </div>
        ) : null}
        {/* 标签 */}
        <div id="tagDiv">
          <div className="space-20" />
          <div>
            <div className="container text-left pl-15 overflow-hidden">
              <div
                className="tagScroll"
                style={{ width: `${this.state.categoryList.length * 140}px`, transform: `translateX(${this.state.scrollWidth}px)` }}
              >
                {this.state.categoryList.map(({ categoryName, id }) => (
                  <div
                    onClick={() => {
                      this.toggleTag(id);
                    }}
                    className={`button-tag ${this.state.query.categoryId === id ? 'active' : ''}`}
                    key={id}
                  >
                    {categoryName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 卡片 */}
        <div className="container">
          {this.state.list.length > 0 ? (
            this.state.list.map(({ id, goodMainImg, goodName, getCondition, goodUrl }) => (
              <div className="col-sm-4 col-md-3" key={id}>
                <div className="card">
                  <div
                    className="card-img mb-10 pointer"
                    onClick={() => {
                      navigate(goodUrl);
                    }}
                  >
                    <img alt="" src={goodMainImg} className="width-100" />
                  </div>
                  <div className="plr-20">
                    <p
                      className="font-14 cart-text p-ellips pointer"
                      title={goodName}
                      onClick={() => {
                        navigate(goodUrl);
                      }}
                    >
                      {goodName}
                    </p>
                    <p className="font-12 mb-10 cart-text p-ellips" title={getCondition}>
                      {getCondition}
                    </p>
                    {loginStatus ? (
                      <div
                        className="button-collection"
                        onClick={() => {
                          this.showModal('modal_transfer', { data: { goodsId: id, goodMainImg, goodName, getCondition, uid: userInfo.id } });
                        }}
                      >
                        领取
                      </div>
                    ) : (
                      <div
                        className="button-collection"
                        onClick={() => {
                          this.showModal('modal_login');
                        }}
                      >
                        登录后领取
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ marginTop: '100px' }}>
              <i className="iconfont icon-zanwushuju color-fff" style={{ fontSize: '100px' }} />
              <p style={{ color: '#545454' }}>暂无数据</p>
            </div>
          )}
        </div>

        {this.state.list.length > 0 && this.state.pageBottom ? (
          <div>
            <i className="iconfont icon-meiyouneirong" />
            <div className="space-10" />
            <p className="color-54 font-14">最后一页</p>
          </div>
        ) : null}

        <div className="space-30" />
        <Modal
          show={modal_login.show}
          title="账号登录"
          footer={false}
          onCancel={() => {
            this.closeModal('modal_login');
          }}
        >
          <Login
            ref="login"
            onCancel={() => {
              this.closeModal('modal_login');
            }}
            toRegister={this.toRegister}
            login={(account, password) => {
              this.login(account, password);
            }}
            loginError={loginError}
          />
        </Modal>
        <Modal
          show={modal_register.show}
          title="账号注册"
          onCancel={() => {
            this.closeModal('modal_register');
          }}
        >
          <Register
            show={modal_register.show}
            ref="register"
            onCancel={() => {
              this.closeModal('modal_register');
            }}
            toLogin={this.toLogin}
            register={(account, password, code) => {
              this.register(account, password, code);
            }}
          />
        </Modal>
        <TransferModal
          data={modal_transfer.data}
          show={modal_transfer.show}
          handleClose={() => {
            this.closeModal('modal_transfer');
          }}
        />
      </div>
    );
  }
}

class LoginStatus extends Component {
  render() {
    const { userInfo, loginStatus } = this.props;
    const { showModal, toggleCartShow } = this.props;
    return loginStatus ? (
      <div>
        <span className="color-userName">欢迎您！{userInfo.account}</span> |{' '}
        <span
          className="pointer"
          onClick={() => {
            toggleCartShow(true);
          }}
        >
          个人中心
        </span>{' '}
        |{' '}
        <span className="pointer" onClick={this.props.loginOut}>
          退出
        </span>
      </div>
    ) : (
      <div>
        <span>
          您好，请
          <span
            className="button-login"
            onClick={() => {
              showModal('modal_login');
            }}
          >
            登录{' '}
          </span>
        </span>
        |
        <span
          className="pointer"
          onClick={() => {
            showModal('modal_register');
          }}
        >
          {' '}
          免费注册{' '}
        </span>
      </div>
    );
  }
}

export default App;
