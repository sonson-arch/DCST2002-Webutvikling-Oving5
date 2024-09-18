import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Task } from './task-service';


class TaskList extends Component {
  tasks: Task[] = [];

  render() {
    return (
      <Card title="Tasks">
        <Row>
          <Column width={4}>Title</Column>
          <Column width={4}>Done</Column>
          <Column width={4}>Actions</Column>
        </Row>
        {this.tasks.map((task, id) => (
          <Row key={id}>
            <Column width={4}>{task.title}</Column>
            <Column width={4}>{task.done ? 'Yes' : 'No'}</Column>
            <Column width={4}>
              <Button.Light onClick={() => this.setDone(task.id, !task.done)}>
                {task.done ? 'Undo' : 'Done'}
              </Button.Light>
              <Button.Light onClick={() => this.deleteTask(task.id)}>Delete</Button.Light>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  async setDone(id: number, done: boolean): Promise<void> {
    await taskService.setDone(id, done);
    this.tasks = await taskService.getAll();
    this.forceUpdate(); // Oppdater komponenten
  }

  async deleteTask(id: number): Promise<void> {
    await taskService.delete(id);
    this.tasks = await taskService.getAll();
    this.forceUpdate(); // Oppdater komponenten
  }

  mounted() {
    taskService.getAll().then((tasks) => {
      this.tasks = tasks;
      this.forceUpdate(); // Oppdater komponenten
    });
  }
}

class TaskNew extends Component {
  title = '';

  render() {
    return (
      <Card title="New task">
        <Row>
          <Column width={1}>
            <Form.Label>Title:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.title}
              onChange={(event) => (this.title = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Button.Success
          onClick={() => {
            taskService.create(this.title).then(() => {
              // Reloads the tasks in the Tasks component
              TaskList.instance()?.mounted(); // .? meaning: call TaskList.instance().mounted() if TaskList.instance() does not return null
              this.title = '';
            });
          }}
        >
          Create
        </Button.Success>
      </Card>
    );
  }
}


let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <TaskList />
      <TaskNew />
    </>,
  );
