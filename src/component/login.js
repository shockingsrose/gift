import React, { Component } from 'react';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      password: '',
      error: ''
    };
  }

  componentWillReceiveProps(props) {
    if (props.loginError !== '') {
      this.setState({ error: props.loginError });
    }
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };

  login = () => {
    if (this.state.account === '' || this.state.password === '') {
      this.setState({ error: `${this.state.account === '' ? '请输入账号' : '请输入密码'}` });
      return;
    }
    // 调用登录接口 如果成功，关闭modal 否则提示密码错误
    if (true) {
      //  调用父组件的
      this.props.login(this.state.account, this.state.password);
    } else {
    }
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
          没有账号？
          <span className="button-login" onClick={this.props.toRegister}>
            免费注册
          </span>
        </p>
      </div>
    );
  }
}

export default Login;
