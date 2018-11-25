import React, { Component } from 'react';
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
      query: {
        pageIndex: 1,
        pageSize: 12
      }
    };
  }

  toggleTag = (id) => {
    this.setState({ tagSelected: id });
  };

  handlePageChange = (...args) => {
    console.log(args);
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="App-logo">LOGO</div>
              </div>
              <div className="col-sm-6">
                <div className="text-right">
                  <p className="App-login-text">
                    <span>
                      您好，请<span className="button-login">登录 </span>
                    </span>
                    |<span className="pointer"> 免费注册</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-30" />
        {/* 标签 */}
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
      </div>
    );
  }
}

export default App;
