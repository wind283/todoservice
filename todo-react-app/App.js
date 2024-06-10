import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import AppRouter from './AppRouter';
import {call, signout} from './service/ApiService';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { id: '0', title: "Todo 1", done: false, selected: false, priority: 0 },
        { id: '1', title: "Todo 2", done: false, selected: false, priority: 0 },
      ],
      loading:true,
	    currentPage: 1,
      itemsPerPage: 8,
      currentTime: new Date(),
    };
  }

  componentDidMount() {
    call("/todo", "GET", null).then((response) => { // 수정된 부분
      this.setState({ items: response.data, loading: false }); // 수정된 부분
    });
    this.intervalID = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidUpdate() {
    localStorage.setItem('items', JSON.stringify(this.state.items));
  }

  add = (item) => {
    call("/todo","POST",item).then((response)=>{
      this.setState({items:response.data})  
  });
    const thisItems = this.state.items;
    item.id = "ID-" + thisItems.length;
    item.done = false;
    item.priority = 0; // 초기 중요도 설정
    thisItems.push(item);
    this.setState({ items: thisItems });
    console.log("items:", this.state.items);
  }

  delete = (item) => {
    call("/todo","DELETE",item).then((response)=>{
      this.setState({items:response.data})  
  });
    const thisItems = this.state.items;
    const newItems = thisItems.filter(e => e.id !== item.id);
    this.setState({ items: newItems }, () => {
      console.log("Update Items:", this.state.items);
    });
  }


  toggleSelect = (item) => {
    const thisItems = this.state.items.map(e => {
      if (e.id === item.id) {
        e.selected = !e.selected;
      }
      return e;
    });
    this.setState({ items: thisItems });
  }

  deleteSelected = () => {
    const thisItems = this.state.items.filter(e => !e.selected);
    this.setState({ items: thisItems }, () => {
      console.log("Deleted selected items:", this.state.items);
    });
  }

  deleteAll = () => {
    this.setState({ items: [] }, () => {
      console.log("Deleted all items:", this.state.items);
    });
  }

  handlePageChange = (event, newPage) => {
    this.setState({ currentPage: newPage });
  }

  setPriority = (item, priority) => {
    const thisItems = this.state.items.map(e => {
      if (e.id === item.id) {
        e.priority = priority;
      }
      return e;
    });
    this.setState({ items: thisItems });
  }

  update = (item) => {
    call("/todo","PUT",item).then((response)=>
      this.setState({items:response.data})  
    );
  }

  toggleComplete = (item) => {
    const thisItems = this.state.items.map(e => {
      if (e.id === item.id) {
        e.done = !e.done;
      }
      return e;
    });
    this.setState({ items: thisItems });
  }

  onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(this.state.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    this.setState({ items });
  }

  render() {
    const { items, currentPage, itemsPerPage, currentTime } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    var todoItems = currentItems.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {currentItems.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Todo
                          item={item}
                          key={item.id}
                          toggleSelect={this.toggleSelect}
                          delete={this.delete}
                          setPriority={this.setPriority}
                          toggleComplete={this.toggleComplete}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    );
 var navigationBar = (
      <AppBar position="static">
        <Toolbar>
          <Grid justify = "space-betwwen" container>
            <Grid item>
              <Typography variant = "h6">오늘의 할 일</Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" onClick={signout}>logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );

    var todoListPage = (
      <div>
      {navigationBar}
      <Container maxWidth="md">
        <AddTodo add = {this.add} />
        <div className="TodoList">{todoItems}</div>
      </Container>
      </div>
    );

    var loadingPage = <h1>로딩중..</h1>
    var content = loadingPage;

    if(!this.state.loading) {
      content = todoListPage;
    }

    return (
      <div className="App">
        <Container maxWidth="md">
          <div className="current-time">
            {currentTime.toLocaleTimeString()}
          </div>
          <AddTodo add={this.add} />
          <div className="TodoList">{todoItems}</div>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.deleteSelected}
            style={{ marginTop: 16 }}
          >
            선택 삭제
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.deleteAll}
            style={{ marginTop: 16, marginLeft: 8 }}
          >
            Todo 초기화
          </Button>
          <div style={{ marginTop: 16 }}>
            {Array.from(Array(totalPages), (e, i) => {
              return (
                <Button
                  key={i}
                  variant="outlined"
                  color="primary"
                  onClick={(e) => this.handlePageChange(e, i + 1)}
                  style={{ margin: 4 }}
                >
                  {i + 1}
                </Button>
              );
            })}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
