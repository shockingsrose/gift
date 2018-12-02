import React, { Component } from 'react';
import Modal from './component/Modal';

class Test extends Component {
  constructor() {
    super();
    this.state = {
      modal1: { show: false },
      modal2: { show: false }
    };
  }

  render() {
    const { modal1, modal2 } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ modal1: { show: true } });
          }}
        >
          显示modal1
        </button>
        <button
          onClick={() => {
            this.setState({ modal2: { show: true } });
          }}
        >
          显示modal2
        </button>
        <Modal
          show={modal1.show}
          onCancel={() => {
            this.setState({ modal1: { show: false } });
          }}
        />
        <Modal
          show={modal2.show}
          onCancel={() => {
            this.setState({ modal2: { show: false } });
          }}
        />
      </div>
    );
  }
}
export default Test;
