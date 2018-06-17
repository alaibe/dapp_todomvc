import React from 'react';
import classNames from 'classnames';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

class TodoFooter extends React.Component {
  pluralize(count, word) {
    return count === 1 ? word : word + 's';
  }

  render() {
    var activeTodoWord = this.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
          Clear completed
        </button>
      );
    }

    var nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#"
              onClick={() => this.props.updateNowShowing(ALL_TODOS)}
              className={classNames({selected: nowShowing === ALL_TODOS})}>
              All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#"
              onClick={() => this.props.updateNowShowing(ACTIVE_TODOS)}
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
              Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#"
              onClick={() => this.props.updateNowShowing(COMPLETED_TODOS)}
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export default TodoFooter;
