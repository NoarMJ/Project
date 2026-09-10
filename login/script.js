// =========================
// TaskFlow Login
// =========================


// =========================
// DOM Elements
// =========================

const loginForm = document.querySelector('#loginForm');

const emailInput = document.querySelector('#email');

const passwordInput = document.querySelector('#password');

const emailError = document.querySelector('#emailError');

const passwordError =
    document.querySelector('#passwordError');

const statusMessage =
    document.querySelector('#statusMessage');


// =========================
// Login
// =========================

loginForm.addEventListener('submit', function (event) {

    event.preventDefault();


    // Clear previous messages

    emailError.textContent = '';

    passwordError.textContent = '';

    statusMessage.textContent = '';


    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    let isValid = true;


    // =========================
    // Validate Email
    // =========================

    if (email === '') {

        emailError.textContent =
            'Email is required.';

        isValid = false;

    }


    // =========================
    // Validate Password
    // =========================

    if (password === '') {

        passwordError.textContent =
            'Password is required.';

        isValid = false;

    }


    if (!isValid) {

        return;

    }


    // =========================
    // Get Saved Users
    // =========================

    const users = JSON.parse(
        localStorage.getItem('taskflowUsers')
    ) || [];


    // =========================
    // Find User
    // =========================

    const user = users.find(
        function (user) {

            return (
                user.email === email &&
                user.password === password
            );

        }
    );


    // =========================
    // Invalid Login
    // =========================

    if (!user) {

        statusMessage.textContent =
            'Incorrect email or password.';

        return;

    }


    // =========================
    // Create Login Session
    // =========================

    localStorage.setItem(
        'taskflowCurrentUser',
        JSON.stringify({
            email: user.email
        })
    );


    // =========================
    // Success
    // =========================

    statusMessage.textContent =
        'Login successful.';


    // =========================
    // Go To Dashboard
    // =========================

    setTimeout(function () {

        window.location.href =
            '../dashboard/index.html';

    }, 500);

});