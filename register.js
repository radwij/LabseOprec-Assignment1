class RegisterUser {
  constructor(name, username, email, password, messageElement, form, accToken, url) {
    this.name = name
    this.username = username
    this.email = email
    this.password = password
    this.messageElement = messageElement
    this.form = form
    this.accToken = accToken
    this.url = url
  }

  // Method to handle form submission
  handleFormSubmission() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault() // Prevent form submission

      // Log the values of username, email, and password
      console.log('Name:', this.name.value)
      console.log('Username:', this.username.value)
      console.log('Email:', this.email.value)
      console.log('Password:', this.password.value)

      // Create a user data object
      const userData = {
        username: this.username.value,
        name: this.name.value, 
        email: this.email.value,
        password: this.password.value,
        language: 'en'
      }

      // Send a POST request to the server
      fetch(this.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
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
        console.log('User registration successful:', data)
        this.messageElement.textContent = "Registration successful"
      })
      .catch(error => {
        // Handle error
        console.error('Error registering user:', error)
        this.messageElement.textContent = "Error registering user"
      })
    })
  }
}

// Const for fetching BE
const accToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ4MDhiMjJhYmNjOTBhNGM2N2I0MjciLCJpYXQiOjE3MDg2NTc5OTQsImV4cCI6MTcxMTI0OTk5NH0.32zR-PL0Pn_ux8jVmDzMX6iX4RXhWV1W1IBu4i7wOyY"
const url = "https://oprec-api.labse.in/api/user"


// Instantiate RegisterUser class
const registerUser = new RegisterUser(
  document.querySelector('#name'),
  document.querySelector('#username'),
  document.querySelector('#email'),
  document.querySelector('#password'),
  document.querySelector('.messageElement'),
  document.querySelector('#register-form'),
  accToken,
  url
)

// Call the handleFormSubmission method
registerUser.handleFormSubmission()