import React, { Component } from 'react';
import showTime from '../../utils/showTIme';
import './style.css';
import userSrc from './userCenter.png';
import arrowRight from './arrow-right.png';
import productSrc from './product.jpeg';

const data = [
  { orderNumber: '123456', productTitle: '商品名称商品名称商品名称商品名称商品名称商品名称', endTime: '2018-12-12' },
  { orderNumber: '123457', productTitle: '商品名称商品名称商品名称商品名称商品名称商品名称', endTime: '2018-12-12 11:12:21' },
  { orderNumber: '213123123143', productTitle: '商品名称商品名称商品名称商品名称商品名称商品名称', endTime: '2018-11-12' },
  { orderNumber: '213123123153', productTitle: '商品名称商品名称商品名称商品名称商品名称商品名称', endTime: '2018-11-12' }
];
class Cart extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      // 1代表未过期 0代表过期
      type: 1
    };
  }

  componentWillMount() {
    this.getList(1);
  }

  getList = (type) => {
    const list = type === 1 ? data.filter((item, index) => index < 2) : data.filter((item, index) => index >= 2);
    this.setState({ list, type });
  };

  render() {
    const { list, type } = this.state;
    const { getList } = this;
    const { show, handleClose, showModal } = this.props;

    return (
      <div className={`${show ? 'move-left' : 'move-right'} cart-wrap`}>
        <div className="cart-header">
          <div className="row">
            <div className="col-sm-6">
              <img src={userSrc} alt="" className="mr-10 middle" />
              <span className="weight-500 middle">个人中心</span>
            </div>
            <div className="col-sm-6">
              <div className="text-right">
                <img src={arrowRight} alt="" className="middle pointer" width="20" onClick={handleClose} />
              </div>
            </div>
          </div>
        </div>
        <div className="tab-wrap">
          <span
            className={`${type === 1 ? 'tab-red' : ''} pointer`}
            onClick={() => {
              getList(1);
            }}
          >
            未到期
          </span>{' '}
          |{' '}
          <span
            className={`${type === 0 ? 'tab-red' : ''} pointer`}
            onClick={() => {
              getList(0);
            }}
          >
            已到期
          </span>
        </div>
        <div className="cart-content">
          {list.map((item) => (
            <Product
              {...item}
              key={item.orderNumber}
              showTransferModal={() => {
                showModal(item);
              }}
            />
          ))}
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

  renderTime = (endTime) => {
    let time = showTime(this.props.endTime);
    time = time ? `剩余${time.day}天${time.hour}时${time.min}分${time.second}秒` : false;
    this.setState({ time: time });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { orderNumber, productTitle, showTransferModal } = this.props;
    const { time } = this.state;
    return (
      <div className="product-wrap">
        <div className="">
          <div className="float-left product-img-wrap">
            <img src={productSrc} alt="" className="width-100" />
          </div>
          <div className="product-content-pos">
            <div className="product-content-wrap">
              <p className="color-999">订单编号: {orderNumber}</p>
              <p>{productTitle}</p>
              <div className="product-content-operate">
                {time ? (
                  <div className="product-time">{time}</div>
                ) : (
                  <div>
                    <div className="product-outTime mr-20">剩余0天</div>
                    <div className="product-refund pointer" onClick={showTransferModal}>
                      申请退款
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
