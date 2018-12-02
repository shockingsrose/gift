import React, { Component } from 'react';
import Modal from './component/Modal';
import Register from './component/register';
import TransferModal from './component/transfer';
import Cart from './component/cart';
import Login from './component/login';
import Paginate from 'react-paginate';
import './App.css';
import './grid.css';
import src1 from './img1.png';
import left from './向左.png';
import userSrc from './component/cart/userCenter.png';
import arrowRight from './component/cart/arrow-right.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tagList: [
        { tagName: '全部', id: 1 },
        { tagName: '衣服', id: 2 },
        { tagName: '鞋子', id: 3 },
        { tagName: '电器', id: 4 },
        { tagName: '数码', id: 5 },
        { tagName: '零食', id: 6 },
        { tagName: '其他', id: 7 }
      ],
      list: [
        { id: 1, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 2, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 3, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 4, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 5, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 6, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 7, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 8, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 9, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 10, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 11, img: '', name: '商品名称', description: '领取条件领取条件领取条件' },
        { id: 12, img: '', name: '商品名称', description: '领取条件领取条件领取条件' }
      ],
      tagSelected: 1,
      // 是否滚动了
      scrolled: false,
      // header的margin-bottom的值（tagDiv切换position时改变）
      marginBottom: 0,
      query: {
        pageIndex: 1,
        pageSize: 12
      },
      modal_login: {
        show: false
      },
      modal_register: {
        show: false
      },
      // 转账
      modal_transfer: {
        show: true,
        code: '',
        data: {}
      },
      loginStatus: false,
      loginError: '',
      userInfo: {
        account: ''
      },
      cartShow: false
    };
  }

  componentDidMount() {
    this.addScrollEvent();
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

  toggleTag = (id) => {
    this.setState({ tagSelected: id });
  };

  handlePageChange = (...args) => {
    console.log(args);
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
    Promise.resolve('')
      .then(() => {
        this.closeModal('modal_login');
        this.closeModal('modal_register');
        this.toggleLoginStatus(true);
        this.refs.login.clear();
        const userInfo = Object.assign(this.state.userInfo, { account });
        this.setState({ userInfo });
      })
      .catch(() => {
        this.setState({ loginError: '账号或密码错误' });
      });
  };

  register = (account, password) => {
    // 调用接口
    Promise.resolve('')
      .then(() => {
        this.refs.register.clear();
        this.closeModal('modal_register');
        this.showModal('modal_login');
      })
      .catch(() => {});
  };

  loginOut = () => {
    Promise.resolve('').then(() => {
      this.setState({ loginStatus: false, userInfo: {} });
    });
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
    const { scrolled, marginBottom, loginStatus, loginError } = this.state;
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
                    <LoginStatus loginStatus={loginStatus} showModal={this.showModal} userInfo={this.state.userInfo} loginOut={this.loginOut} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* cart */}
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
          show={cartShow}
          showModal={() => {
            this.showModal('modal_transfer');
          }}
          handleClose={() => {
            this.toggleCartShow(false);
          }}
        />
        {/* 标签 */}
        <div className={`${scrolled ? 'scrolled' : ''}`} id="tagDiv">
          <div className="space-20" />
          <div className="container text-left pl-15">
            {this.state.tagList.map(({ tagName, id }) => (
              <div
                onClick={() => {
                  this.toggleTag(id);
                }}
                className={`button-tag ${this.state.tagSelected === id ? 'active' : ''}`}
                key={id}
              >
                {tagName}
              </div>
            ))}
          </div>
        </div>

        <div className="space-10" />
        {/* 卡片 */}
        <div className="container">
          <div className="row" />
          {this.state.list.map(({ id, img, name, description }) => (
            <div className="col-sm-4 col-md-3" key={id}>
              <div className="card">
                <div className="card-img mb-10">
                  <img alt="" src={img} />
                </div>
                <div className="plr-20">
                  <p className="font-14 cart-text">{name}</p>
                  <p className="font-12 mb-10 cart-text">{description}</p>
                  <div className="button-collection">领取</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-30" />
        <div className="block-center">
          <Paginate
            previousLabel={<img src={left} alt="" />}
            nextLabel={<img src={left} alt="" className={'right'} />}
            breakLabel={<img src={src1} alt="" />}
            pageCount={20}
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
          />
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
            register={(account, password) => {
              this.register(account, password);
            }}
          />
        </Modal>
        <TransferModal
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
    const { showModal } = this.props;
    return loginStatus ? (
      <div>
        <span className="color-userName">欢迎您！{userInfo.account}</span> | <span className="pointer">个人中心</span> |{' '}
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
