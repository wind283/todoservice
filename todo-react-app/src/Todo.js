import React from 'react';
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Star, StarBorder, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { item: props.item, readOnly: true };
    this.delete = props.delete;
    this.toggleSelect = props.toggleSelect;
    this.setPriority = props.setPriority;
    this.toggleComplete = props.toggleComplete;
  }

  deleteEventHandler = () => {
    this.delete(this.state.item);
  }

  offReadOnlyMode = () => {
    this.setState({ readOnly: false });
  }

  enterKeyEventHandler = (e) => {
    if (e.key === 'Enter') {
      this.setState({ readOnly: true });
    }
  }

  editEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.title = e.target.value;
    this.setState({ item: thisItem });
  }

  checkboxEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.done = !thisItem.done;
    this.setState({ item: thisItem });
  }

  toggleSelectEventHandler = () => {
    this.toggleSelect(this.state.item);
  }

  setPriorityHandler = (priority) => {
    this.setPriority(this.state.item, priority);
  }

  toggleCompleteEventHandler = () => {
    this.toggleComplete(this.state.item);
  }

  render() {
    const item = this.state.item;
    return (
      <ListItem>
        <IconButton
          className={`toggle-complete ${item.done ? 'completed' : ''}`}
          onClick={this.toggleCompleteEventHandler}
        >
          {item.done ? (
            <CheckBox style={{ color: 'white', fontSize: '1.5rem' }} />
          ) : (
            <CheckBoxOutlineBlank style={{ color: 'white', fontSize: '1.5rem' }} />
          )}
        </IconButton>
        <ListItemText className={item.done ? 'completed' : ''}>
          <InputBase
            inputProps={{ 'aria-label': 'naked', readOnly: this.state.readOnly }}
            type="text"
            id={item.id}
            name={item.id}
            value={item.title}
            multiline={true}
            fullWidth={true}
            onClick={this.offReadOnlyMode}
            onChange={this.editEventHandler}
            onKeyPress={this.enterKeyEventHandler}
          />
        </ListItemText>
        <div>
          {[1, 2, 3].map((num) => (
            <IconButton
              key={num}
              onClick={() => this.setPriorityHandler(num)}
              style={{ color: item.priority >= num ? 'gold' : 'gray', padding: 4 }}
            >
              {item.priority >= num ? (
                <Star style={{ fontSize: '1.5rem' }} />
              ) : (
                <StarBorder style={{ fontSize: '1.5rem' }} />
              )}
            </IconButton>
          ))}
        </div>
        <ListItemSecondaryAction>
          <Checkbox
            checked={item.selected || false}
            onChange={this.toggleSelectEventHandler}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Todo;