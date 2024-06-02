document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("form1").addEventListener("submit", function(event) {
        event.preventDefault();

        var xhr = new XMLHttpRequest();
        var formData = new FormData(document.getElementById("form1"));

        xhr.open("POST", "/");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        xhr.onload = function() {
            if (xhr.status === 200) {
              console.log(xhr);
              console.log(xhr.responseText,';555555555555555555');
                var response = JSON.parse(xhr.responseText);
                document.getElementById("form1").reset();
                document.getElementById("check").innerHTML = response.Success;

                setTimeout(function() {
                    document.getElementById("check").innerHTML = "";
                }, 3000);

                if (response.Success === "You are regestered,You can login now.") {
                    document.getElementById("aa").click();
                }
            }
        };

        xhr.onerror = function() {
            // Handle errors here
        };

        xhr.send(new URLSearchParams(formData).toString());
    });
});




document.addEventListener("DOMContentLoaded", function () {
  let state = false;
  let passwordInput = document.getElementById("password");
  let passwordStrength = document.getElementById("password-strength");
  let generateButton = document.getElementById("generate-password");

  passwordInput.addEventListener("keyup", function () {
    let pass = passwordInput.value;
    checkStrength(pass);
    updateCriteriaIcons(pass);
  });

  let eyeIcon = document.getElementById("eye-icon");

  eyeIcon.addEventListener("click", function () {
    toggle();
    myFunction(eyeIcon);
  });

  generateButton.addEventListener("click", function () {
    // Generate a strong password
    let generatedPassword = generateStrongPassword();
    // Pass the generated password to the password input field
    passwordInput.value = generatedPassword;
    // Trigger the keyup event to update the password strength and criteria icons
    passwordInput.dispatchEvent(new Event('keyup'));
  });

  passwordInput.addEventListener("keyup", function () {
    let pass = passwordInput.value;
    checkStrength(pass);
    updateCriteriaIcons(pass);
  });

  function toggle() {
    if (state) {
      passwordInput.setAttribute("type", "password");
      state = false;
    } else {
      passwordInput.setAttribute("type", "text");
      state = true;
    }
  }

  function myFunction(show) {
    show.classList.toggle("fa-eye-slash");
  }

  function updateProgressBar(strength) {
    let width = (strength / 4) * 100; // Calculate width based on strength
    passwordStrength.style.width = width + "%";
  }

  function updateProgressBar(strength) {
    let progressBar = document.getElementById("password-strength");
    let width = (strength / 12) * 100; // Calculate width based on strength

    progressBar.style.width = width + "%";

    // Set progress bar color based on strength
    if (strength < 9) {
      progressBar.className = "progress-bar progress-bar-danger";
    } else if (strength === 2 || strength === 3) {
      progressBar.className = "progress-bar progress-bar-warning";
    } else {
      progressBar.className = "progress-bar progress-bar-success";
    }
  }
  // Function to generate a random strong password
// Function to generate a random strong password
function generateStrongPassword() {
  // Define character sets for each type of character
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Combine all character sets into one string
  const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

  let password = '';
  let hasLowercase = false;
  let hasUppercase = false;
  let hasDigit = false;
  let hasSpecialChar = false;

  
  while (password.length < 12 || !hasLowercase || !hasUppercase || !hasDigit || !hasSpecialChar) {
      // Choose a random character from the combined set
      const randomIndex = Math.floor(Math.random() * allChars.length);
      const randomChar = allChars[randomIndex];

      // Check if the character type is already present in the password
      if (lowercaseChars.includes(randomChar)) hasLowercase = true;
      if (uppercaseChars.includes(randomChar)) hasUppercase = true;
      if (digitChars.includes(randomChar)) hasDigit = true;
      if (specialChars.includes(randomChar)) hasSpecialChar = true;

      // Add the random character to the password
      password += randomChar;
  }

  return password;
}



  function checkStrength(password) {
    let strength = 0;

    // If password contains both lower and uppercase characters
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 3;
    }

    // If it has numbers and characters
    if (password.match(/([0-9])/)) {
      strength += 3;
    }

    // If it has one special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 3;
    }

    // If password is greater than or equal to 8 characters
    if (password.length >= 12) {
      strength += 3;
    }

    // Update progress bar
    updateProgressBar(strength);

    // Update strength text based on strength
    let strengthText = "";
    if (strength === 12) {
      strengthText = "Strong";
    } else if (strength >= 9) {
      strengthText = "Medium";
    } else {
      strengthText = "Weak";
    }
    

    document.getElementById("strength-text").innerText = strengthText;
    if (strength === 12) {
      document.getElementById("registration-button").disabled = false;
  } else {
      document.getElementById("registration-button").disabled = true;
  }
  }

  // Function to show password criteria when password field is clicked
  function showPasswordCriteria() {
    let popover = document.getElementById("popover-password");
    popover.style.display = "block";
  }

  // Function to toggle password criteria visibility
  function togglePasswordCriteria() {
    let popover = document.getElementById("popover-password");
    popover.style.display = popover.style.display === "none" ? "block" : "none";
  }

  // Function to hide password criteria when clicking on other fields
  document.addEventListener("click", function(event) {
    let passwordField = document.getElementById("password");
    let popover = document.getElementById("popover-password");
    if (event.target !== passwordField && event.target !== popover && !popover.contains(event.target)) {
      // Clicked outside the password field and popover, hide popover
      popover.style.display = "none";
    }
  });

  

  // Call updateCriteriaIcons whenever password input changes
  function updateCriteriaIcons(password) {
    let lowUpperCase = document.querySelector(".low-upper-case i");
    let number = document.querySelector(".one-number i");
    let specialChar = document.querySelector(".one-special-char i");
    let eightChar = document.querySelector(".eight-character i");

    // If password contains both lower and uppercase characters
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      lowUpperCase.classList.remove("fa-circle");
      lowUpperCase.classList.add("fa-check");
    } else {
      lowUpperCase.classList.add("fa-circle");
      lowUpperCase.classList.remove("fa-check");
    }

    // If it has numbers and characters
    if (password.match(/([0-9])/)) {
      number.classList.remove("fa-circle");
      number.classList.add("fa-check");
    } else {
      number.classList.add("fa-circle");
      number.classList.remove("fa-check");
    }

    // If it has one special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      specialChar.classList.remove("fa-circle");
      specialChar.classList.add("fa-check");
    } else {
      specialChar.classList.add("fa-circle");
      specialChar.classList.remove("fa-check");
    }

    // If password is greater than or equal to 8 characters
    if (password.length >= 8) {
      eightChar.classList.remove("fa-circle");
      eightChar.classList.add("fa-check");
    } else {
      eightChar.classList.add("fa-circle");
      eightChar.classList.remove("fa-check");
    }
  }

  // Add event listener to password field to trigger showPasswordCriteria function
  passwordInput.addEventListener("click", showPasswordCriteria);
});


  

