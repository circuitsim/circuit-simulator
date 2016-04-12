import React from 'react';
import radium from 'radium';
import Color from 'color';
import R from 'ramda';

import EditNumeric from './option-types/Number';
import Button from '../../components/Button';

import camelToSpace from '../../utils/camelToSpace';

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
  title: STYLES.title
});

class ComponentInspector extends React.Component {

  constructor(props) {
    super(props);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  onOptionChange(option, value) {
    const {id} = this.props.selectedComponent;
    this.props.onChangeComponentOption(id, option, value);
  }

  handleDelete() {
    this.props.onDeleteComponent(this.props.selectedComponent.id);
  }

  render() {
    const {
      selectedComponent,
      style
    } = this.props;
    const styles = getStyles(this.context.theme);

    return (
      <div style={R.merge(style, styles.container)}>
        {(() => {
          if (selectedComponent) {
            const { typeID, options } = selectedComponent;
            const optionKeys = R.keys(options);

            const editComponents = optionKeys.map(key => {
              let EditComponent;
              switch (options[key].type) {
              case 'number':
                EditComponent = EditNumeric;
                break;
              default:
                return null;
              }

              return (
                <EditComponent
                  key={key}
                  option={key}
                  value={options[key].value}
                  componentId={selectedComponent.id}
                  unit={options[key].unit}
                  onChangeValue={this.onOptionChange}
                />
              );
            });

            return (
              <div style={R.merge(styles.outerBase, styles.content.outer)}>
                <div style={styles.title}>
                  {camelToSpace(typeID)}
                </div>

                {editComponents}

                <Button style={styles.button}
                  onClick={this.handleDelete}
                  danger
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
    options: PropTypes.object
  }),

  // action creators
  onChangeComponentOption: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

ComponentInspector.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(ComponentInspector);
