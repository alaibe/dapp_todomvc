import React from 'react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editText: this.props.todo.text }
  }

  handleSubmit(event) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.text});
  }

  handleKeyDown (event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event) {
    if (this.props.editing) {
      this.setState({editText: event.target.value});
    }
  }

  render(){
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={this.props.todo.completed}
          onChange={this.props.onToggle}
        />
        <label onDoubleClick={this.handleEdit.bind(this)}>
          {this.props.todo.text}
        </label>
        <button className="destroy" onClick={this.props.onDestroy} />
      </div>
      <input
        ref="editField"
        className="edit"
        value={this.state.editText}
        onBlur={this.handleSubmit.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
      />
    </li>
    )
  }
}

export default TodoItem
