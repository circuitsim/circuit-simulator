import React from 'react';
import ComponentSelector from './component-selection/ComponentSelector.js';
import ComponentInspector from './component-inspection/ComponentInspector.js';

const { PropTypes } = React;

export default class Sidebar extends React.Component {
  render() {
    const { style, onSelectMode, selectedComponent, deleteComponent } = this.props;
    return (
      <div style={style}>
        <ComponentSelector onButtonClicked={onSelectMode} style={{flexGrow: 1}} />
        <ComponentInspector selectedComponent={selectedComponent} deleteComponent={deleteComponent} />
        <div style={{alignSelf: 'center'}} >
          <span>
            Made by <a href='http://thomwright.co.uk'>Thom Wright</a> - <a href='https://github.com/circuitsim'><span className='octicon octicon-mark-github'></span></a>
          </span>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  style: PropTypes.object,

  onSelectMode: PropTypes.func.isRequired,

  selectedComponent: PropTypes.object,
  deleteComponent: PropTypes.func.isRequired
};
