import React, { Component } from 'react';
class Register extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      password: '',
      auth: '',
      error: '',
      step: 1,
      second: '验证'
    };
    this.authTimer = {};
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };

  nextStep = () => {
    if (this.state.account === '' || this.state.auth === '') {
      this.setState({ error: `${this.state.account === '' ? '请输入手机号/邮箱' : '请输入验证码'}` });
      return;
    }
    console.log(`账号${this.state.account}`);
    console.log(`验证码${this.state.auth}`);
    // 调用接口 判断验证码是否正确
    setTimeout(() => {
      this.setState({ step: 2, error: '' });
    }, 300);
  };

  clear = () => {
    this.setState({ account: '', password: '', error: '', auth: '', step: 1 });
  };

  countDown = () => {
    this.authTimer = setInterval(() => {
      if (this.state.second === '验证') {
        this.setState({ second: 1 });
      } else if (this.state.second === 0) {
        clearInterval(this.authTimer);
        this.setState({ second: '验证' });
      } else {
        this.setState({ second: this.state.second - 1 });
      }
    }, 1000);
  };
  getAuthCode = () => {
    console.log('调用获取验证码');
  };
  // 验证
  validate = () => {
    if (!this.state.account) {
      this.setState({ error: '请输入手机号/邮箱' });
      return;
    }
    if (this.state.second === '验证') {
      this.getAuthCode();
      this.countDown();
      this.setState({ error: '' });
    }
  };
  // 登录
  login = () => {
    if (this.state.account === '' || this.state.password === '') {
      this.setState({ error: `${this.state.account === '' ? '请输入账号' : '请输入密码'}` });
      return;
    }
    console.log(`账号${this.state.account}`);
    console.log(`密码${this.state.password}`);

    // 调用登录接口 如果成功，关闭modal 否则提示密码错误
    if (true) {
      //  调用父组件的
      this.props.register(this.state.account, this.state.password);
    } else {
    }
  };

  render() {
    const { account, password, auth, error, step, second } = this.state;
    return (
      <div>
        {step === 1 ? (
          <div>
            <div className="input-control block-center">
              <input
                className="input"
                value={account}
                placeholder="请输入手机号/邮箱"
                onChange={(e) => {
                  this.handleInputChange('account', e.target.value);
                }}
              />
              <span
                className="input-prefix icon-auth"
                onClick={() => {
                  this.validate();
                }}
              >
                {second}
              </span>
            </div>
            <input
              className="input"
              value={auth}
              placeholder="请输入验证码"
              onChange={(e) => {
                this.handleInputChange('auth', e.target.value);
              }}
            />
            {error !== '' ? (
              <p style={{ width: '240px' }} className="text-err text-left inline-block mb-10">
                {error}
              </p>
            ) : null}

            <div className="button-red" onClick={this.nextStep}>
              下一步
            </div>
          </div>
        ) : (
          <div>
            <div className="text-left block-center mb-20 pl-15 color-4d" style={{ width: '240px' }}>
              <p className="p-ellips inline-block" style={{ width: '150px', height: '30px', lineHeight: '30px' }}>
                手机：{account}
              </p>
              <span className="float-right icon-auth-success">已验证</span>
              <div className="clearfix" />
            </div>
            <input
              className="input"
              value={password}
              type="password"
              placeholder="请输入密码"
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
              完成注册
            </div>
          </div>
        )}
        <div className="space-20" />
        <p>
          没有账号？点此
          <span className="button-login" onClick={this.props.toLogin}>
            登录
          </span>
        </p>
      </div>
    );
  }
}

export default Register;