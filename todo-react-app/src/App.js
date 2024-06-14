import React from 'react';
import Todo from './Todo.js';
import AddTodo from './AddTodo.js';
import { Paper, List, Container, Grid, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import AppRouter from './AppRouter.js';
import { call } from './service/ApiService.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { id: '0', title: "Todo 1", done: false, selected: false, priority: 0 },
        { id: '1', title: "Todo 2", done: false, selected: false, priority: 0 },
      ],
      loading: true,
      currentPage: 1,
      itemsPerPage: 8,
      currentTime: new Date(),
    };
  }

  componentDidMount() {
    call("/todo", "GET", null).then((response) => {
      const items = response.data.map((item, index) => ({
        ...item,
        id: item.id.toString(),
        index: index
      }));
      this.setState({ items, loading: false });
    });
    this.intervalID = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items !== this.state.items) {
      localStorage.setItem('items', JSON.stringify(this.state.items));
    }
  }

  add = (item) => {
    call("/todo", "POST", item).then((response) => {
      const items = response.data.map((item, index) => ({
        ...item,
        id: item.id.toString(),
        index: index
      }));
      this.setState({ items });
    });
  }

  delete = (item) => {
    call("/todo", "DELETE", item).then((response) => {
      const items = response.data.map((item, index) => ({
        ...item,
        id: item.id.toString(),
        index: index
      }));
      this.setState({ items });
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
    call("/todo/all", "DELETE").then((response) => {
      this.setState({ items: [] });
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
    call("/todo", "PUT", item).then((response) => {
      this.setState({ items: response.data });
    });
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
    const currentItems = items.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">오늘의 할 일</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <div className="current-time">
            {currentTime.toLocaleTimeString()}
          </div>
          <AddTodo add={this.add} />
          <Paper style={{ margin: 16 }}>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef}>
                    {currentItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Todo
                              item={item}
                              toggleSelect={this.toggleSelect}
                              delete={this.delete}
                              setPriority={this.setPriority}
                              toggleComplete={this.toggleComplete}
                              update={this.update}
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
            {Array.from(Array(totalPages), (e, i) => (
              <Button
                key={i}
                variant="outlined"
                color="primary"
                onClick={(e) => this.handlePageChange(e, i + 1)}
                style={{ margin: 4 }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
