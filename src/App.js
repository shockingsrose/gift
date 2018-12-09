import React, { Component } from 'react';
import Cookies  from 'js-cookie';
import Modal from './component/Modal';
import Register from './component/register';
import TransferModal from './component/transfer';
import Cart from './component/cart';
import Login from './component/login';
import Paginate from 'react-paginate';
import './App.css';
import './grid.css';
import apiUser from './api/user';
import apiGood from './api/good';
import apiCategory from './api/category';
import src1 from './img1.png';
import left from './向左.png';
import userSrc from './component/cart/userCenter.png';
import arrowRight from './component/cart/arrow-right.png';

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
      pageTotal: 0,
      // 是否滚动了
      scrolled: false,
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
        token: '',
      },
      cartShow: false
    };
  }

  componentDidMount() {
    this.checkAuth();
    this.addScrollEvent();
    this.getCategoryList();
    
  }

  checkAuth() {
    const  account =  Cookies.get('account');
    const  userId =  Cookies.get('userId');
    const  token =  Cookies.get('token');
    if (token) {
      this.setState({ loginStatus: true, userInfo: { account, id: userId, token } });
    }
  }

  // 滚动事件
  addScrollEvent() {
    document.body.addEventListener('mousewheel', (e) => {
      //监听滚动事件 当超过滚动距离50px 为tagDiv增加scrolled类，并改变marginBottom的值
      if (window.scrollY > 50 && !this.state.scrolled) {
        const tagDiv = document.getElementById('tagDiv');
        const tagStyle = window.getComputedStyle(tagDiv);
        this.setState({ scrolled: true, marginBottom: tagStyle['height'] });
      } else if (window.scrollY <= 50 && this.state.scrolled) {
        this.setState({ scrolled: false, marginBottom: 0 });
      }
    });
  }

  getList(data = this.state.query) {
    apiGood.getList(data).then(({ list, total }) => {
      this.setState({ list, pageTotal: Math.ceil(total/this.state.query.pageSize) });
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
    this.setState({ query: Object.assign(this.state.query, { categoryId: id }) }, () => {
      this.getList();
    });
  };

  handlePageChange = ({ selected }) => {
    this.setState({ query: Object.assign(this.state.query, { pageNum: selected + 1 })},
    () => {
      this.getList();
    }
    )
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
      .then(({id, token}) => {
        this.closeModal('modal_login');
        this.closeModal('modal_register');
        this.toggleLoginStatus(true);
        this.refs.login.clear();
        const userInfo = Object.assign(this.state.userInfo, { account, id, token });
        this.setState({ userInfo });
        
        Cookies.set('account', account, { expires: 7 });
        Cookies.set('userId', id, {expires: 7} );
        Cookies.set('token', token, {expires: 7} );
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
        this.refs.register.clear();
        this.closeModal('modal_register');
        this.showModal('modal_login');
      })
      .catch(() => {});
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
    const { scrolled, marginBottom, loginStatus, loginError, userInfo, pageTotal } = this.state;
    const { modal_login, modal_register, cartShow, modal_transfer } = this.state;
    const { toggleCartShow } = this;
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
        {loginStatus ? 
        <div>
          <div
          className="App-cart pointer"
          onClick={() => {
            toggleCartShow(true);
          }}
        >
          <div className="ptb-10">
            <img src={arrowRight} alt="" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="ptb-10">
            <img src={userSrc} alt="" />
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
          loginStatus={ loginStatus }
        />
        </div> 
        : null}
        {/* 标签 */}
        <div className={`${scrolled ? 'scrolled' : ''}`} id="tagDiv">
          <div className="space-20" />
          <div className="container text-left pl-15">
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

        <div className="space-10" />
        {/* 卡片 */}
        <div className="container">
          <div className="row" />
          {this.state.list.map(({ id, goodMainImg, goodName, getCondition }) => (
            <div className="col-sm-4 col-md-3" key={id}>
              <div className="card">
                <div className="card-img mb-10">
                  <img alt="" src={goodMainImg} className="width-100" />
                </div>
                <div className="plr-20">
                  <p className="font-14 cart-text p-ellips" title={goodName}>
                    {goodName}
                  </p>
                  <p className="font-12 mb-10 cart-text p-ellips" title={getCondition}>
                    {getCondition}
                  </p>
                  <div
                    className="button-collection"
                    onClick={() => {
                      this.showModal('modal_transfer', { data: { goodsId: id, goodMainImg, goodName, getCondition, uid: userInfo.id } });
                    }}
                  >
                    领取
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-30" />
        <div className="block-center">
          {pageTotal <= 0 
          ? <p>暂无商品</p> 
          : <Paginate
            previousLabel={<img src={left} alt="" />}
            nextLabel={<img src={left} alt="" className={'right'} />}
            breakLabel={<img src={src1} alt="" />}
            pageCount={pageTotal}
            marginPagesDisplayed={5}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageChange}
            containerClassName={'pagination'}
            nextClassName={'next-page'}
            previousClassName={'previous-page'}
            pageLinkClassName={'pageLinkClassName'}
            activeClassName={'active'}
            pageClassName={'page'}
            breakClassName={'break-me'}
          />}
        </div>
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
