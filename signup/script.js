// =========================
// TaskFlow Signup
// =========================


// =========================
// DOM Elements
// =========================

const signupForm = document.querySelector('#signupForm');

const nameInput = document.querySelector('#name');

const emailInput = document.querySelector('#email');

const passwordInput = document.querySelector('#password');

const confirmPasswordInput =
    document.querySelector('#confirmPassword');

const nameError = document.querySelector('#nameError');

const emailError = document.querySelector('#emailError');

const passwordError =
    document.querySelector('#passwordError');

const confirmPasswordError =
    document.querySelector('#confirmPasswordError');

const statusMessage =
    document.querySelector('#statusMessage');


// =========================
// Signup
// =========================

signupForm.addEventListener('submit', function (event) {

    event.preventDefault();


    // Clear previous errors

    clearErrors();


    const name = nameInput.value.trim();

    const email = emailInput.value.trim().toLowerCase();

    const password = passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    let isValid = true;


    // =========================
    // Validate Name
    // =========================

    if (name === '') {

        showError(
            nameError,
            'Name is required.'
        );

        isValid = false;

    }


    // =========================
    // Validate Email
    // =========================

    if (email === '') {

        showError(
            emailError,
            'Email is required.'
        );

        isValid = false;

    } else if (!email.includes('@')) {

        showError(
            emailError,
            'Please enter a valid email address.'
        );

        isValid = false;

    }


    // =========================
    // Validate Password
    // =========================

    if (password === '') {

        showError(
            passwordError,
            'Password is required.'
        );

        isValid = false;

    }


    // =========================
    // Validate Confirm Password
    // =========================

    if (confirmPassword === '') {

        showError(
            confirmPasswordError,
            'Please confirm your password.'
        );

        isValid = false;

    } else if (password !== confirmPassword) {

        showError(
            confirmPasswordError,
            'Passwords do not match.'
        );

        isValid = false;

    }


    // Stop if validation failed

    if (!isValid) {

        return;

    }


    // =========================
    // Get Existing Users
    // =========================

    const users = JSON.parse(
        localStorage.getItem('taskflowUsers')
    ) || [];


    // =========================
    // Check Existing Account
    // =========================

    const existingUser = users.find(
        function (user) {

            return user.email === email;

        }
    );


    if (existingUser) {

        showError(
            emailError,
            'An account with this email already exists.'
        );

        return;

    }


    // =========================
    // Create User
    // =========================

    const newUser = {

        name: name,

        email: email,

        password: password

    };


    users.push(newUser);


    // =========================
    // Save Users
    // =========================

    localStorage.setItem(
        'taskflowUsers',
        JSON.stringify(users)
    );


    // =========================
    // Create Login Session
    // =========================

    localStorage.setItem(
        'taskflowCurrentUser',
        JSON.stringify({
            email: email
        })
    );


    // =========================
    // Success Message
    // =========================

    statusMessage.textContent =
        'Account created successfully.';


    // =========================
    // Go To Dashboard
    // =========================

    setTimeout(function () {

        window.location.href =
            '../dashboard/index.html';

    }, 500);

});


// =========================
// Show Error
// =========================

function showError(element, message) {

    element.textContent = message;

}


// =========================
// Clear Errors
// =========================

function clearErrors() {

    nameError.textContent = '';

    emailError.textContent = '';

    passwordError.textContent = '';

    confirmPasswordError.textContent = '';

    statusMessage.textContent = '';

}