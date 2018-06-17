pragma solidity ^0.4.23;

contract TodoFactory {

  event NewTodo(uint todoId, string text);
  event TodoUpdated(uint todoId, string text, bool completed);
  event TodoToggled(uint todoId, string text, bool completed);
  event TodoDeleted(uint todoId);

  struct Todo {
    string text;
    bool completed;
  }

  modifier onlyOwner(uint _todoId) {
    require(msg.sender == todoToOwner[_todoId]);
    _;
  }

  Todo[] todos;

  mapping(uint => address) todoToOwner;
  mapping(address => uint) ownerTodoCount;

  function addTodo(string _text) external {
    uint id = todos.push(Todo(_text, false)) - 1;
    todoToOwner[id] = msg.sender;
    ownerTodoCount[msg.sender]++;
    emit NewTodo(id, _text);
  }

  function getTodos() external view returns (uint[]) {
    uint[] memory result = new uint[](ownerTodoCount[msg.sender]);
    uint counter = 0;
    for (uint i = 0; i < todos.length; i++) {
      if (todoToOwner[i] == msg.sender) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getTodo(uint _todoId) external view onlyOwner(_todoId) returns(uint, string, bool) {
    return (_todoId, todos[_todoId].text, todos[_todoId].completed);
  }

  function deleteTodo(uint _todoId) public onlyOwner(_todoId) {
    delete todos[_todoId];
    delete todoToOwner[_todoId];
    ownerTodoCount[msg.sender]--;
    emit TodoDeleted(_todoId);
  }

  function updateTodo(uint _todoId, string _text) external onlyOwner(_todoId) {
    todos[_todoId].text = _text;
    emit TodoUpdated(_todoId, _text, todos[_todoId].completed);
  }

  function toggleTodo(uint _todoId) external onlyOwner(_todoId) {
    if (todos[_todoId].completed == true) {
      todos[_todoId].completed = false;
    } else {
      todos[_todoId].completed = true;
    }
    emit TodoToggled(_todoId, todos[_todoId].text, todos[_todoId].completed);
  }

  function clearCompleted() external {
    for (uint i = 0; i < todos.length; i++) {
      if (todoToOwner[i] == msg.sender && todos[i].completed == true) {
        deleteTodo(i);
      }
    }
  }
}
