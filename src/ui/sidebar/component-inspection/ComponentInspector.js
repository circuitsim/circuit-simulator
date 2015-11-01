import React from 'react';
import radium from 'radium';
import Color from 'color';
import R from 'ramda';
import {unformatSI} from 'format-si-prefix';

import Button from '../../components/Button.js';

import Components from '../../diagram/components';
import camelToSpace from '../../utils/camelToSpace.js';

const { PropTypes } = React;

const lighten = s => new Color(s).lighten(0.2).rgbString();
const darken = s => new Color(s).darken(0.2).rgbString();

const getStyles = ({COLORS, STYLES}) => ({
  container: {
    display: 'flex',
    padding: '10px',
    margin: '5px 5px',
    backgroundColor: COLORS.insetBackground,
    borderRadius: '4px',
    boxShadow: [
      `inset 0.5px 0.5px 1px 0px ${darken(COLORS.insetBackground)}`,
      `inset -0.5px -0.5px 1px 0px ${lighten(COLORS.insetBackground)}`,
      `-0.5px -0.5px 1px 0px ${darken(COLORS.background)}`,
      `0.5px 0.75px 0.75px 0px ${lighten(COLORS.background)}`
    ].join(', ')
  },
  outerBase: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: '1'
  },
  content: {
    outer: {
      justifyContent: 'space-around',
      alignItems: 'flex-start'
    }
  },
  empty: {
    outer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    inner: {
      alignSelf: 'center'
    }
  },
  value: {
    outer: {
      padding: '10px 0px'
    },
    input: {
      padding: '2px',
      backgroundColor: COLORS.textInputBackground,
      color: COLORS.base,
      borderRadius: '2px',
      border: '1px solid transparent',

      ':focus': {
        border: '1px solid transparent',
        color: COLORS.semiHighlight
      }
    }
  },
  title: STYLES.title
});

const isOkNumber = R.allPass([
  R.is(Number),
  R.compose(R.not, Number.isNaN)
]);

class ComponentInspector extends React.Component {

  constructor(props) {
    super(props);
    const { selectedComponent } = props;
    this.state = {
      value: selectedComponent ? selectedComponent.props.value : undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  onValueChange(event) {
    const value = event.target.value;
    this.setState({
      value: value || ''
    });
    const numericVal = unformatSI(value);
    if (isOkNumber(numericVal)) {
      this.props.onChangeComponentValue(this.props.selectedComponent.id, numericVal);
    }
  }

  handleDelete() {
    this.props.onDeleteComponent(this.props.selectedComponent.id);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedComponent } = nextProps;
    this.state = {
      value: selectedComponent ? selectedComponent.props.value : undefined
    };
  }

  render() {
    const { selectedComponent, style } = this.props;
    const styles = getStyles(this.context.theme);
    return (
      <div style={R.merge(style, styles.container)}>
        {(() => {
          if (selectedComponent) {
            const { typeID } = selectedComponent;
            const unit = Components[typeID].unit;
            const value = this.state.value;
            const showValue = () => (
              <div style={styles.value.outer}>
                <input style={styles.value.input}
                  name='value'
                  min='0'
                  value={value}
                  onChange={this.onValueChange}
                />
                <span style={{paddingLeft: '5px'}}>
                  {unit}
                </span>
              </div>
            );

            return (
              <div style={R.merge(styles.outerBase, styles.content.outer)}>
                <div style={styles.title}>
                  {camelToSpace(typeID)}
                </div>
                {value == null ? null : showValue()}
                <Button style={styles.button}
                  onClick={this.handleDelete}
                >
                  <span>Delete</span>
                </Button>
              </div>
            );
          } else {
            return (
              <div style={R.merge(styles.outerBase, styles.empty.outer)}>
                <span style={styles.empty.inner}>No component selected</span>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

ComponentInspector.propTypes = {
  style: PropTypes.object,

  // state
  selectedComponent: PropTypes.shape({
    typeID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    props: PropTypes.shape({
      value: PropTypes.number
    }).isRequired
  }),

  // action creators
  onChangeComponentValue: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

ComponentInspector.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(ComponentInspector);
