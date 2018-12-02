import React, { Component } from 'react';
import './style.css';
import closeImg from './close.png';
class Modal extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    this.setState({ show: this.props.show });
    // const modalBoxEle = document.querySelector('.modal-box');
    // modalBoxEle.style['display'] = 'none';
  }

  componentWillReceiveProps(props) {
    // const modalBoxEle = document.querySelector('.modal-box');
    // modalBoxEle.style['display'] = 'block';
    const { show } = props;
    if (show) {
      document.body.style.overflow = 'hidden';
      // modalBoxEle.style['display'] = 'block';
    } else {
      document.body.style.overflow = 'auto';
    }
    // 同步modal内部的show
    this.setState({ show });
  }

  // handleOk = (fn) => {
  //   this.setState({ show: false });
  //   if (typeof fn === 'function') {
  //     fn.call(null);
  //   }
  // };
  // handleCancel = (fn) => {};

  handleEvent = (e, fn) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ show: false });
    if (typeof fn === 'function') {
      fn.call(null);
    } else {
      return;
    }
  };
  render() {
    const { show } = this.state;
    const { onOk, onCancel, title, width = 320, footer } = this.props;
    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        {/* <div className={`modal-box ${show ? 'fadeIn' : 'fadeOut'}`}> */}
        <div className="mask" />
        <div
          className="modal-wrap"
          onClick={(e) => {
            this.handleEvent(e, onCancel);
          }}
        >
          <div
            className="modal"
            style={{ width }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <div className="pointer text-right">
                <img
                  src={closeImg}
                  alt=""
                  width="20"
                  onClick={(e) => {
                    this.handleEvent(e, onCancel);
                  }}
                />
              </div>
              <div className="modal-title">{title}</div>
              <div className="space-10" />
            </div>
            <div className="modal-body">{this.props.children}</div>
            <div className="space-20" />
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
