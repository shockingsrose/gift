import React, { Component } from 'react';
import apiUser from '../api/user';
class Register extends Component {
  constructor() {
    super();
    this.state = {
      account: '',
      password: '',
      auth: '',
      error: '',
      step: 1,
      second: '验证',
      success: false
    };
    this.authTimer = {};
  }

  handleInputChange = (key, value) => {
    this.setState({ [key]: value });
  };
  // 获取验证码
  getAuthCode = (account, type = 2) => {
    apiUser.getCode({ account, type }).catch((err) => {
      this.setState({ error: '获取验证码失败' });
    });
  };

  //验证二维码
  validateCode = (account, code) => {
    apiUser
      .checkCode({ account, code })
      .then(() => {
        this.setState({ step: 2, error: '' });
      })
      .catch(() => {
        this.setState({ error: '验证码错误，请重新输入' });
      });
  };

  nextStep = () => {
    if (this.state.account === '' || this.state.auth === '') {
      this.setState({ error: `${this.state.account === '' ? '请输入手机号/邮箱' : '请输入验证码'}` });
      return;
    }

    // 调用接口 判断验证码是否正确
    this.validateCode(this.state.account, this.state.auth);
  };

  clear = () => {
    this.setState({ account: '', password: '', error: '', auth: '', success: false, step: 1 });
  };

  countDown = () => {
    this.authTimer = setInterval(() => {
      if (this.state.second === '验证') {
        this.setState({ second: 59 });
      } else if (this.state.second === 0) {
        clearInterval(this.authTimer);
        this.setState({ second: '验证' });
      } else {
        this.setState({ second: this.state.second - 1 });
      }
    }, 1000);
  };
  // 验证
  validate = () => {
    if (!this.state.account) {
      this.setState({ error: '请输入手机号/邮箱' });
      return;
    }
    const reg_phone = /^((13[0-9])|(15[^4,\\D])|(17[0-9])|(18[0,5-9]))\d{8}$/;
    const reg_email = /^([a-z0-9A-Z]+[-|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?.)+[a-zA-Z]{2,}$/;

    const phoneValidate = reg_phone.test(this.state.account);
    const emialValidate = reg_email.test(this.state.account);

    if (!(phoneValidate || emialValidate)) {
      this.setState({ error: '手机号或者邮箱格式不正确' });
      return;
    }

    if (this.state.second === '验证') {
      this.getAuthCode(this.state.account, phoneValidate ? 2 : 1);
      this.countDown();
      this.setState({ error: '' });
    }
  };
  // 注册
  register = () => {
    if (this.state.password === '') {
      this.setState({ error: '请输入密码' });
      return;
    }

    this.setState({ error: '', success: true });
    setTimeout(() => {
      const { auth, account, password } = this.state;
      this.props.register(account, password, auth);
    }, 2000);
  };

  render() {
    const { account, password, auth, error, step, second, success } = this.state;
    return (
      <div>
        {step === 1 ? (
          <div>
            <div className="input-control block-center input-bg">
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
            <div className="input-control block-center input-bg">
              <input
                className="input"
                value={auth}
                placeholder="请输入验证码"
                onChange={(e) => {
                  this.handleInputChange('auth', e.target.value);
                }}
              />
            </div>

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
              <p className="p-ellips inline-block" style={{ width: '160px', height: '30px', lineHeight: '30px' }} title={account}>
                账号：{account}
              </p>
              <span className="float-right icon-auth-success">已验证</span>
              <div className="clearfix" />
            </div>
            <div className="input-control block-center input-bg">
              <input
                className="input"
                value={password}
                type="password"
                placeholder="请输入6位密码"
                maxLength="6"
                onChange={(e) => {
                  this.handleInputChange('password', e.target.value);
                }}
              />
            </div>

            {error !== '' ? (
              <p style={{ width: '240px' }} className="text-err text-left inline-block mb-10">
                {error}
              </p>
            ) : null}
            {success ? (
              <p style={{ width: '240px' }} className="text-success text-left inline-block mb-10">
                完成注册,2秒之后自动跳转到登录页面
              </p>
            ) : null}
            <div className="button-red" onClick={this.register}>
              完成注册
            </div>
          </div>
        )}
        <div className="space-20" />
        <p>
          已有账号？点此
          <span className="button-login" onClick={this.props.toLogin}>
            登录
          </span>
        </p>
      </div>
    );
  }
}

export default Register;
