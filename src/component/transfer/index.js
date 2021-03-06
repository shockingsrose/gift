import React, { Component } from 'react';
import Modal from '../Modal';
import qrcode from './qrcode.png';
import apiOrder from '../../api/order';
import './style.css';

class TransferModal extends Component {
  constructor() {
    super();
    this.state = {
      payCode: '',
      error: '',
      success: false,
    };
  }

  inputChange = (e) => {
    this.setState({ payCode: e.target.value });
  };

  submit = () => {
    if (!this.state.payCode) {
      this.setState({ error: '请输入支付代码' });
      return;
    }
    // 调用接口
    const reqData = { payCode: this.state.payCode, uid: Number(this.props.data.uid), goodsId: Number(this.props.data.goodsId) };
    apiOrder
      .add(reqData)
      .then(() => {
        this.setState({success: true});
        setTimeout(() => {
          this.props.handleClose();
          this.setState({ payCode: '', error: '', success: false });
        }, 500);
      })
      .catch(() => {
        this.setState({ error: '请输入正确的支付代码' });
      });
  };

  render() {
    const { show, handleClose, data } = this.props;
    const { payCode, error, success } = this.state;
    const { inputChange, submit } = this;
    const { goodName, goodMainImg, getCondition } = data;
    return (
      <Modal title="转账" show={show} onCancel={handleClose}>
        <div className="transfer-content">
          <div className="text-left">
            <div className="float-left mr-10">
              <img src={goodMainImg} alt="" width="60" />
            </div>
            <p className="font-14 p-ellips" title={goodName}>
              {goodName}
            </p>
            <p className="font-12" title={getCondition}>
              {getCondition}
            </p>
            <div className="clearfix space-20" />
          </div>
          <div>
            <div className="col-sm-6">
              <div>
                <img src={qrcode} alt="" width="100" />
                <p className="text-wx mt-10">微信</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <img src={qrcode} alt="" width="100" />
                <p className="text-zfb">支付宝</p>
              </div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="transfer-inputWrap">
            <div className="input-control block-center input-bg">
              <input className="input" value={payCode} onChange={inputChange} placeholder="请输入支付代码" />
            </div>
            {error === '' ? null : (
              <p className="text-err text-left block-center" style={{ width: '240px' }}>
                {error}
              </p>
            )}
            {
              success ?  
              <p className="text-success text-left block-center mb-20" style={{ width: '240px' }}>         
                  支付成功
              </p> : null
            }
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
