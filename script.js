const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener('submit',function(event){ // add event listener to form submit
    event.preventDefault();


// resets state if validated
    let isValid = true;
    clearError(emailInput, emailError); // remove error from the email box
    clearError(passwordInput, passwordError); // remove any previous
    statusMessage.textContent = "";

const emailValue =  emailInput.value.trim();

if (emailValue === '') {
    showError( 
        emailInput, 
        emailError,
        "Email is required"
    );
    isValid = false;
} else if (!emailValue.includes("@")) {
    showError(
        emailInput,
        emailError,
        "Please enter a valid email address"
    );
    isValid = false;
}

const passwordValue = passwordInput.value;

if (passwordValue ==='') {
    showError(
        passwordInput,
        passwordError,
        "Password is required"
    );
    isValid = false;
} else if (passwordValue.length < 8) {
    showError(
        passwordInput,
        passwordError,
        "Password must be at least 8 characters long"
    );
    isValid = false;
}

if (isValid) {
    statusMessage.textContent = "Login successful!";
    statusMessage.classList.add("success");
    form.reset();   
}

function showError(input, errorEl, message) {
  input.classList.add('invalid');
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove('invalid');
  errorEl.textContent = '';
}
    
});