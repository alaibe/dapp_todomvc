import React from 'react';
import ReactDOM from 'react-dom'
import EmbarkJS from 'Embark/EmbarkJS';
import TodoFactory from 'Embark/contracts/TodoFactory';
import '../node_modules/todomvc-app-css/index.css';

import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

const ENTER_KEY = 13;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: '',
    }
  }

  componentDidMount(){ 
    __embarkContext.execWhenReady(() => {
      this._reloadTodos();
      this._listenToEvents();
    });
  }

  updateNowShowing(value) {
    this.setState({ nowShowing: value })
  }

  handleChange(event) {
    this.setState({newTodo: event.target.value});
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    if (val) {
      TodoFactory.methods.addTodo(val).send({from: web3.eth.defaultAccount});
      this.setState({newTodo: ''});
    }
  }

  clearCompleted() {
    TodoFactory.methods.clearCompleted().send({from: web3.eth.defaultAccount});
  }

  toggle(todo) {
    TodoFactory.methods.toggleTodo(todo.id).send({from: web3.eth.defaultAccount});
  }

  destroy(todo) {
    TodoFactory.methods.deleteTodo(todo.id).send({from: web3.eth.defaultAccount});
  }

  edit(todo) {
    this.setState({editing: todo.id});
  }

  save(todo, text) {
    TodoFactory.methods.updateTodo(todo.id, text).send({from: web3.eth.defaultAccount});
    this.setState({editing: null});
  }

  cancel() {
    this.setState({editing: null});
  }

  async _reloadTodos() {
    var todoIds = await TodoFactory.methods.getTodos().call()
    var todos = []
    for (let todoId in todoIds){
      var todo = await TodoFactory.methods.getTodo(todoId).call();
      todos.push({id: todo[0], text: todo[1], completed: todo[2]});
    }
    this.setState({todos: todos});
  }

  _listenToEvents() {
    // TodoFactory.events.NewTodo({}, {fromBlock: 1}, function(error, event){ 
    //   console.log(error);
    // }).on('data', function(event){
    //   console.log(event);
    // })  
  }

  render(){
    var footer;
    var main;
    var shownTodos = this.state.todos.filter(function (todo) {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    var todoItems = shownTodos.map(function (todo) {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    var activeTodoCount = this.state.todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = this.state.todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={this.state.nowShowing}
        updateNowShowing={this.updateNowShowing.bind(this)}
        onClearCompleted={this.clearCompleted.bind(this)}
      />;
    }
    if (this.state.todos.length) {
      main = (
        <section className="main">
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <div>
          <header className="header">
            <h1>todos</h1>
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              value={this.state.newTodo}
              onKeyDown={this.handleNewTodoKeyDown.bind(this)}
              onChange={this.handleChange.bind(this)}
              autoFocus={true}
            />
          </header>
          {main}
          {footer}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
