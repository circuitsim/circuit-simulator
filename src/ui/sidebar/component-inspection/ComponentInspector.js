import React from 'react';
import Components from '../../diagram/components';

const { PropTypes } = React;

export default class ComponentInspector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    };
    // this.onValueChange = this.onValueChange.bind(this);
    // this.onValueKeyPress = this.onValueKeyPress.bind(this);
    // this.onDelete = this.onDelete.bind(this);
  }

  // onValueChange(event) {
  //   const value = event.target.value;
  //   this.setState({
  //     value
  //   });
  //   console.log('onValueChange', value);
  //   // TODO this.props.changeComponentValue(this.props.selectedComponent.id, value);
  // }
  //
  // onValueKeyPress(event) {
  //   console.log('onValueKeyPress', event.which);
  //   console.log(this.state.value || this.props.selectedComponent.props.value);
  // }
  //
  // onDelete() {
  //   console.log('Delete');
  //   this.props.deleteComponent(this.props.selectedComponent.id);
  // }

  render() {
    const { selectedComponent } = this.props;
    return (
      <div>
        {(() => {
          if (selectedComponent) {
            const {typeID, props: {value}} = selectedComponent;
            const unit = Components[typeID].unit;

            // <div>
            //   <input type='number' name='value' min='1' max='1000000' value={value} onChange={this.onValueChange} onKeyPress={this.onValueKeyPress} />{unit}
            // </div>
            const showValue = () => (
              <div>{value}{unit}</div>
            );

            // <button type='button' onClick={this.onDelete}>Delete</button>
            return (
              <div>
                <div>{typeID}</div>
                {value ? showValue() : null}
              </div>
            );
          } else {
            return (
              <span>No component selected</span>
            );
          }
        })()}
      </div>
    );
  }
}

ComponentInspector.propTypes = {
  // state
  selectedComponent: PropTypes.shape({
    typeID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    props: PropTypes.shape({
      value: PropTypes.number
    }).isRequired
  })

  // action creators
  // changeComponentValue: PropTypes.func.isRequired,
  // deleteComponent: PropTypes.func.isRequired
};
