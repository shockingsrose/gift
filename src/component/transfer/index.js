import React, { Component } from 'react';
import Modal from '../Modal';
import productPic from '../cart/product.jpeg';
import './style.css';

class TransferModal extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
      error: ''
    };
  }

  inputChange = (e) => {
    this.setState({ code: e.target.value });
  };

  submit = () => {
    if (!this.state.code) {
      this.setState({ error: '请输入支付代码' });
      return;
    }
    // 调用接口
    Promise.resolve('')
      .then(() => {
        this.props.handleClose();
        this.setState({ code: '', error: '' });
      })
      .catch(() => {
        this.setState({ error: '请输入正确的支付代码' });
      });
  };

  render() {
    const { show, handleClose } = this.props;
    const { code, error } = this.state;
    const { inputChange, submit } = this;
    return (
      <Modal title="转账" show={show} onCancel={handleClose}>
        <div className="transfer-content">
          <div className="text-left">
            <div className="float-left mr-10">
              <img src={productPic} alt="" width="60" />
            </div>
            <p className="font-14">产品名称</p>
            <p className="font-12">领取规则领取规则领取规则领取规则</p>
            <div className="clearfix space-20" />
          </div>
          <div>
            <div className="col-sm-6">
              <div>
                <img src={productPic} alt="" width="100" />
                <p className="text-wx mt-10">微信</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <img src={productPic} alt="" width="100" />
                <p className="text-zfb">支付宝</p>
              </div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="transfer-inputWrap">
            <input className="input" value={code} onChange={inputChange} placeholder="请输入支付代码" />
            {error === '' ? null : (
              <p className="text-err text-left block-center" style={{ width: '240px' }}>
                {error}
              </p>
            )}
          </div>
          <div className="button-submit" onClick={submit}>
            提交
          </div>
        </div>
      </Modal>
    );
  }
}

export default TransferModal;
