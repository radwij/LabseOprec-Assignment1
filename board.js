class MandatoryCheck {
  constructor(messageElement, messageElementLoginState, accToken) {
    this.messageElement = messageElement
    this.messageElementLoginState = messageElementLoginState
    this.accToken = accToken
  }

  getLoginState() {
    fetch("https://oprec-api.labse.in/api/user", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accToken}`
      }
    })
    .then(response => {
      // Check if response is ok
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Parse response as JSON
      return response.json()
    })
    .then(data => {
      // Check if user is logged in
      if (data.user && data.user.username) {
        console.log('User is logged in:', data)
        this.messageElementLoginState.textContent = `Logged in as: ${data.user.name}`
      } else {
        this.messageElementLoginState.textContent = "Not logged in";
      }
    })
    .catch(error => {
      // Handle error
      console.error('Error getting login state:', error)
      this.messageElementLoginState.textContent = "Error getting login state";
    })
  }
}
class TaskOperation {
  constructor(mainBoard, form, messageElement, messageElementLoginState, accToken) {
    this.mainBoard = mainBoard
    this.form = form
    this.messageElement = messageElement
    this.messageElementLoginState = messageElementLoginState
    this.accToken = accToken

    this.title = 'Empty'
    this.description = 'Empty'
    this.dueDate = 'Empty'
  }

  getFormValues() {
    this.title = this.form.querySelector('#task-title').value
    this.description = this.form.querySelector('#task-desc').value
    this.dueDate = this.form.querySelector('#task-dueDate').value
  }

  createTask() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault() // Prevent form submission

      console.log('Creating task')
      this.getFormValues()

      console.log('Task Title:', this.title)
      console.log('Task Description:', this.description)
      console.log('Task Due Date:', this.dueDate)

      const taskData = {
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        tags: ['school', 'important']
      }

      fetch("https://oprec-api.labse.in/api/task", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      // Handle results
      .then(response => {
        // Check if response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse response as JSON
        return response.json();
      })
      .then(data => {
        // Handle success
        console.log('Task Added', data)
        this.getTask()
        this.messageElement.textContent = "Task Added"
      })
      .catch(error => {
          // Handle error
          console.error('Error Adding Task:', error)
          this.messageElement.textContent = "Error registering user"
        })
          this.displayTaskDOM()
    })  
  }

  getTask() {
    fetch("https://oprec-api.labse.in/api/task", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accToken}`
      }
    })
    .then(response => {
      // Check if response is ok
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse response as JSON
      return response.json();
    })
    .then(data => {
      // Clear all tasks in DOM
      this.clearTaskDOM()
      // Display all tasks in DOM
      if (data && data.data && data.data.tasks) {
        const tasks = data.data.tasks;
        tasks.forEach(task => {
          this.displayTaskDOM(task);
        });
      }
    })
    .catch(error => {
      // Handle error
      console.error('Error getting tasks:', error);
      this.messageElement.textContent = "Error getting tasks";
    });
  }

  deleteTask(taskId) {
    console.log('Deleting task:', `https://oprec-api.labse.in/api/task/${taskId}`)
    fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Task deleted:', data);
      this.getTask(); // Refresh task list after deletion
      this.messageElement.textContent = "Task Deleted Successfully";
    })
    .catch(error => {
      console.error('Error deleting task:', error);
      this.messageElement.textContent = "Error deleting task";
    })
  }

  updateTask(taskId) {
    console.log('Updating task:', `https://oprec-api.labse.in/api/task/${taskId}`)
    fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        tags: ['school', 'important']
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Task updated:', data);
      this.getTask(); // Refresh task list after update
      this.messageElement.textContent = "Task Updated Successfully";
    })
    .catch(error => {
      console.error('Error updating task:', error);
      this.messageElement.textContent = "Error updating task";
    })
  }

  displayTaskDOM(task) {
    console.log('Displaying task in DOM')
    // Create a new board column div
    const boardColumn = document.createElement('div');
    boardColumn.classList.add('board-column');

    // Set the inner HTML of the board column
    boardColumn.innerHTML = `
      <div class="board-column-title">${task.title}</div>
      <div class="board-column-desc">${task.description}</div>
      <div class="board-column-dueDate">${task.dueDate}</div>
      <button class="delete-task-btn">Delete</button>
      <button class="edit-task-btn">Edit</button>
      <div class="edit-task-form"></div>
    `;

    // Append the board column to the main board
    this.mainBoard.appendChild(boardColumn)

    // Event listener to delete button
    const deleteButton = boardColumn.querySelector('.delete-task-btn');
    deleteButton.addEventListener('click', () => {
      this.deleteTask(task._id)
    })

    // Event listener to edit button
    const editButton = boardColumn.querySelector('.edit-task-btn');
    editButton.addEventListener('click', () => {
      const editTaskFormContainer = boardColumn.querySelector('.edit-task-form')
      this.editTask(task._id, editTaskFormContainer)
    })
  }

  // Display edit task form
  editTask(taskId, editTaskFormContainer) {
    console.log('Editing task:', taskId)
    editTaskFormContainer.innerHTML = `
        <form id="update-task-form">
          <input type="text" id="task-title" placeholder="Task Title">
          <input type="text" id="task-desc" placeholder="Task Description">
          <input type="date" id="task-dueDate">
          <button type="submit">Update Task</button>
          <button class="cancel-btn">Cancel</button>
        </form>
    `

    // Event button listener to cancel edit
    const cancelButton = editTaskFormContainer.querySelector('.cancel-btn')
    cancelButton.addEventListener('click', () => {
      editTaskFormContainer.innerHTML = ''
    })

    const updateTaskForm = editTaskFormContainer.querySelector('#update-task-form')
    // Event listener to update task
    updateTaskForm.addEventListener('submit', (event) => {
      console.log('Entering update task event listener')
      event.preventDefault() // Prevent form submission
      editTaskFormContainer.innerHTML = ''
      this.getFormValues()
      this.updateTask(taskId)
    })
  }

  clearTaskDOM() {
    this.mainBoard.innerHTML = '';
  }
}

// Const for fetching BE
const accToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ4MDhiMjJhYmNjOTBhNGM2N2I0MjciLCJpYXQiOjE3MDg2NTc5OTQsImV4cCI6MTcxMTI0OTk5NH0.32zR-PL0Pn_ux8jVmDzMX6iX4RXhWV1W1IBu4i7wOyY"


// Instantiate MandatoryCheck class
const mandatoryCheck = new MandatoryCheck(
  document.querySelector('.messageElement'),
  document.querySelector('.messageElementLoginState'),
  accToken,
)

// Instantiate TaskOperation class
const taskOperation = new TaskOperation(
  document.querySelector('.main-board'),
  document.querySelector('#task-form'),
  document.querySelector('.messageElement'),
  document.querySelector('.messageElementLoginState'),
  accToken,
)

// Callling all avengers
mandatoryCheck.getLoginState()
taskOperation.getTask()

// Event Listerner
taskOperation.createTask()