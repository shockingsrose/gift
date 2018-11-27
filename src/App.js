import React, { Component } from 'react';
import Modal from './component/Modal';
import Paginate from 'react-paginate';
import './App.css';
import './grid.css';
import src1 from './img1.png';
import left from './向左.png';

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
      loginStatus: false
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
    console.log(modalName);
    let modalData = this.state[modalName];
    modalData = Object.assign(modalData, data, { show: true });
    this.setState({ [modalName]: modalData });
  };

  closeModal = (modalName, data = {}) => {
    let modalData = this.state[modalName];
    modalData = Object.assign(modalData, data, { show: false });
    this.setState({ [modalName]: modalData });
  };
  render() {
    const { scrolled, marginBottom } = this.state;
    const { modal_login, modal_register } = this.state;
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
                  <p className="App-login-text">
                    <span>
                      您好，请
                      <span
                        className="button-login"
                        onClick={() => {
                          this.showModal('modal_login');
                        }}
                      >
                        登录{' '}
                      </span>
                    </span>
                    |
                    <span
                      className="pointer"
                      onClick={() => {
                        this.showModal('modal_register');
                      }}
                    >
                      {' '}
                      免费注册
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

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
        <Modal show={modal_login.show} title="账号登录" footer={false}>
          <Login
            closeModal={() => {
              this.closeModal('modal_login');
            }}
          />
        </Modal>
        {/* <Modal show={modal_register.show} title="账号注册" /> */}
      </div>
    );
  }
}

class Register extends Component {
  constructor() {
    super();
    this.state = {
      account: ''
    };
  }
}
class Login extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      password: '',
      error: ''
    };
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };

  login = () => {
    if (this.state.account === '' || this.state.password === '') {
      this.setState({ error: `${this.state.account === '' ? '请输入账号' : '请输入密码'}` });
      return;
    }
    console.log(`账号${this.state.account}`);
    console.log(`密码${this.state.password}`);
    this.props.closeModal();
    this.clear();
  };

  clear = () => {
    this.setState({ account: '', password: '', error: '' });
  };
  render() {
    const { account, password, error } = this.state;
    return (
      <div>
        <input
          className="input"
          value={account}
          placeholder="请输入手机号/邮箱"
          onChange={(e) => {
            this.handleInputChange('account', e.target.value);
          }}
        />
        <input
          className="input"
          value={password}
          placeholder="请输入密码"
          type="password"
          onChange={(e) => {
            this.handleInputChange('password', e.target.value);
          }}
        />
        {error !== '' ? (
          <p style={{ width: '240px' }} className="text-err text-left inline-block mb-10">
            {error}
          </p>
        ) : null}

        <div className="button-red" onClick={this.login}>
          登录
        </div>
        <div className="space-20" />
        <p>
          没有账号？<span className="button-login">免费注册</span>
        </p>
      </div>
    );
  }
}

export default App;
