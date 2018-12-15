import React, { Component } from 'react';
import showTime from '../../utils/showTIme';
import './style.css';
import apiOrder from '../../api/order';

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      // 1代表未过期 0代表过期
      status: 1
    };
  }

  componentWillMount() {
    this.getList(1);
  }

  componentWillReceiveProps(props) {
    if (props.show) {
      this.getList(1);
    }
  }

  preventBodyScroll() {
    const cartEle = document.querySelector('#cart');
    cartEle.addEventListener(() => {});
  }

  getList = (status) => {
    if (!this.props.loginStatus) {
      return;
    }
    const statusList = status === 0 ? [4, 5] : [1, 2, 3];

    apiOrder.list({ statusList }).then((list = []) => {
      this.setState({ list, status });
    });
  };

  render() {
    const { list, status } = this.state;
    const { getList } = this;
    const { show, handleClose, showModal } = this.props;

    return (
      <div className={`${show ? 'move-left' : 'move-right'} cart-wrap`} id="cart">
        <div className="cart-header">
          <div className="row">
            <div className="col-sm-6">
              {/* <img src={userSrc} alt="" className="mr-10 middle" /> */}
              <span className="weight-500 middle">个人中心</span>
            </div>
            <div className="col-sm-6">
              <div className="text-right">
                {/* <img src={arrowRight} alt="" className="middle pointer" width="20" onClick={handleClose} /> */}
                <i className="iconfont icon-xiangyou pointer" onClick={handleClose} />
              </div>
            </div>
          </div>
        </div>
        <div className="tab-wrap">
          <span
            className={`${status === 1 ? 'tab-red' : ''} pointer`}
            onClick={() => {
              getList(1);
            }}
          >
            未到期
          </span>{' '}
          |{' '}
          <span
            className={`${status === 0 ? 'tab-red' : ''} pointer`}
            onClick={() => {
              getList(0);
            }}
          >
            已到期
          </span>
        </div>
        <div className="cart-content">
          {list.length > 0 ? (
            list.map((item) => (
              <Product
                {...item}
                key={item.orderNo}
                showTransferModal={() => {
                  showModal(item);
                }}
              />
            ))
          ) : (
            <div style={{ marginTop: '30px' }}>
              <i className="iconfont icon-zanwushuju color-54" style={{ fontSize: '50px' }} />
              <p style={{ color: '#545454' }}>暂无订单</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: true
    };
    this.timer = '';
  }

  componentWillMount() {
    this.renderTime();
    this.timer = setInterval(() => {
      this.renderTime();
    }, 1000);
  }

  renderTime = () => {
    let time = showTime(this.props.expireTime);
    time = time ? `剩余${time.day}天${time.hour}时${time.min}分` : false;
    this.setState({ time: time });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { orderNo, goodName, showTransferModal, goodMainImg, status } = this.props;
    const { time } = this.state;

    let renderOperate = '';
    switch (status) {
      case 1:
        renderOperate = <div className="product-time">未确定</div>;
        break;
      case 2:
      case 3:
        renderOperate = <div className="product-time">{time}</div>;
        break;
      case 4:
      case 5:
        renderOperate = (
          <div>
            <div className="product-outTime mr-20">剩余0天</div>
            {/* <div className="product-refund pointer" onClick={showTransferModal}>
            申请退款
          </div> */}
          </div>
        );
        break;
      default:
        renderOperate = <div className="product-time">未确定</div>;
        break;
    }

    return (
      <div className="product-wrap">
        <div className="">
          <div className="float-left product-img-wrap">
            <img src={goodMainImg} alt="" className="width-100" />
          </div>
          <div className="product-content-pos">
            <div className="product-content-wrap">
              <p className="color-999 p-ellips" title={orderNo}>
                订单编号: {orderNo}
              </p>
              <p>{goodName}</p>
              <div className="product-content-operate">{renderOperate}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
