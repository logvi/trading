import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

@inject('loader')
@observer
class Loader extends Component {
  render() {
    return (
      <div className={classNames("loader loader--app", {inactive: !this.props.loader.visible})}>
        <div>
          <div className="sk-cube-grid">
            <div className="sk-cube sk-cube1" />
            <div className="sk-cube sk-cube2" />
            <div className="sk-cube sk-cube3" />
            <div className="sk-cube sk-cube4" />
            <div className="sk-cube sk-cube5" />
            <div className="sk-cube sk-cube6" />
            <div className="sk-cube sk-cube7" />
            <div className="sk-cube sk-cube8" />
            <div className="sk-cube sk-cube9" />
          </div>
          <div id="loader-description" className="loader-description">
            Loading...
          </div>
        </div>
      </div>
    )
  }
}

export default Loader;