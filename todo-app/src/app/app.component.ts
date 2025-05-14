import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Todo, TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AppComponent implements OnInit {

currentDate = new Date().toDateString();




  todos: Todo[] = [];
  newTodo = '';
emptyBlock: TemplateRef<NgIfContext<boolean>> | null | undefined;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    if (!this.newTodo.trim()) return;

    const todo: Todo = {
      title: this.newTodo,
      completed: false,
      checked: false
    };

    this.todoService.addTodo(todo).subscribe((newItem) => {
      this.todos.unshift(newItem);
      this.newTodo = '';
    });
  }

 markComplete(todo: Todo) {
  const updated = { ...todo, completed: true };
  this.todoService.updateTodo(updated).subscribe({
    next: () => (todo.completed = true),
    error: () => {
      // Fake the update even if the API fails
      todo.completed = true;
      console.warn('Fake API failed, but UI updated.');
    }
  });
}
get activeTodos(): Todo[] {
  return this.todos.filter(todo => !todo.completed);
}

get completedTodos(): Todo[] {
  return this.todos.filter(todo => todo.completed);
}
toggleCheck(todo: Todo) {
  todo.checked = true; // temporary visual check

  // delay before marking complete
  setTimeout(() => {
    this.markComplete(todo);
  }, 500); // 0.5 second delay
}

clearCompleted() {
  this.todos = this.todos.filter(todo => !todo.completed);
}


getTodos() {
  // Optional: Fetch from backend or local storage
}



  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
    });
  }
}
