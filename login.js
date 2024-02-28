class LoginUser {
  constructor(email, password, messageElement, messageElementLoginState, form, accToken, url) {
    this.email = email
    this.password = password
    this.messageElement = messageElement
    this.messageElementLoginState = messageElementLoginState
    this.form = form
    this.accToken = accToken
    this.url = url
  }

  // Method to handle form submission
  handleFormSubmission() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault() // Prevent form submission

      // Log the values of username, email, and password
      console.log('Email:', this.email.value)
      console.log('Password:', this.password.value)

      // Create a user data object
      const userData = {
        email: this.email.value,
        password: this.password.value,
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
        console.log('User log in successful:', data)
        this.messageElement.textContent = "Login successful"
        // Call method to get login state after successful login
        this.getLoginState()
      })
      .catch(error => {
        // Handle error
        console.error('Error loggin in user:', error)
        this.messageElement.textContent = "Error loggin in user"
      })
    })
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

// Const for fetching BE
const accToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ4MDhiMjJhYmNjOTBhNGM2N2I0MjciLCJpYXQiOjE3MDg2NTc5OTQsImV4cCI6MTcxMTI0OTk5NH0.32zR-PL0Pn_ux8jVmDzMX6iX4RXhWV1W1IBu4i7wOyY"
const url = "https://oprec-api.labse.in/api/user/login"


// Instantiate LoginUser class
const loginUser = new LoginUser(
  document.querySelector('#email'),
  document.querySelector('#password'),
  document.querySelector('.messageElement'),
  document.querySelector('.messageElementLoginState'),
  document.querySelector('#login-form'),
  accToken,
  url
)

// Callling all avengers
loginUser.getLoginState()
loginUser.handleFormSubmission()