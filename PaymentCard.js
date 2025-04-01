// Input event listeners to update card display
document.querySelector(".card-number-input").oninput = () => {
  let cardNumber = document
    .querySelector(".card-number-input")
    .value.replace(/\s+/g, ""); // Remove existing spaces
  if (cardNumber.length > 19) {
    cardNumber = cardNumber.slice(0, 19); // Truncate to 16 characters if longer
  }
  document.querySelector(".card-number-input").value =
    formatCardNumber(cardNumber);
  document.querySelector(".card-number-box").innerText =
    formatCardNumber(cardNumber);

  // Display length message
  const cardLengthMessage = document.querySelector(".card-length-message");
  if (cardNumber.length === 19) {
    cardLengthMessage.textContent = ""; // Clear message if 16 characters
  } else {
    cardLengthMessage.textContent = "Must be 16 characters";
    cardLengthMessage.style.color = "red";
  }
};

document.querySelector(".card-holder-input").oninput = () => {
  document.querySelector(".card-holder-name").innerText =
    document.querySelector(".card-holder-input").value;
};

document.querySelector(".month-input").oninput = () => {
  document.querySelector(".exp-month").innerText =
    document.querySelector(".month-input").value;
};

document.querySelector(".year-input").oninput = () => {
  document.querySelector(".exp-year").innerText =
    document.querySelector(".year-input").value;
};

document.querySelector(".cvv-input").onmouseenter = () => {
  document.querySelector(".front").style.transform =
    "perspective(1000px) rotateY(-180deg)";
  document.querySelector(".back").style.transform =
    "perspective(1000px) rotateY(0deg)";
};

document.querySelector(".cvv-input").onmouseleave = () => {
  document.querySelector(".front").style.transform =
    "perspective(1000px) rotateY(0deg)";
  document.querySelector(".back").style.transform =
    "perspective(1000px) rotateY(180deg)";
};

document.querySelector(".cvv-input").oninput = () => {
  document.querySelector(".cvv-box").innerText =
    document.querySelector(".cvv-input").value;
};

// Function to format card number with spaces every 4 digits
function formatCardNumber(cardNumber) {
  return cardNumber
    .replace(/\s+/g, "")
    .replace(/(\d{4})/g, "$1 ")
    .trim();
}

// Billing form validation
function validateForm() {
  let isValid = true;
  const inputs = document.querySelectorAll('.checkout-form input[type="text"]');

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      isValid = false;
      addErrorStyles(input, "This field is required");
    } else {
      removeErrorStyles(input);
      // Additional check for email format validation
      if (
        input.getAttribute("type") === "text" &&
        input.getAttribute("id") === "Email"
      ) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          isValid = false;
          addErrorStyles(input, "Please enter a valid email address");
        }
      }
    }
  });

  return isValid;
}

const form = document.querySelector(".checkout-form");
const containerDiv = document.querySelector(".container");
const formContainer = document.querySelector(".form-container");
const paymentForm = document.querySelector(".payment-form");

function handleFormSubmission(event) {
  event.preventDefault();

  const isValid = validateForm();
  if (isValid) {
    console.log("Form is valid. Proceeding to the next step...");

    const formData = {
      shipping_address: {
        address: document.getElementById("Address").value,
        city: document.getElementById("City").value,
        state: document.getElementById("State").value,
        postal_code: document.getElementById("Zipcode").value,
      },
    };

    fetch("/user/Billing-Information", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => {
      if (response.ok) {
        console.log("Billing information saved successfully");
        formContainer.classList.add("hidden");
        containerDiv.classList.remove("hidden");
      } else {
        console.error("Failed to save billing information");
        showErrorPopup("Failed to save billing information");
      }
    });
  } else {
    console.log("Form is invalid");
  }
}

form.addEventListener("submit", handleFormSubmission);

// Payment form validation
function validatePaymentForm() {
  let isFormValid = true;
  const paymentForm = document.querySelector(".payment-form");
  const inputs = paymentForm.querySelectorAll("input, select");

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      isFormValid = false;
      addErrorStyles(input, "This field is required");
    } else {
      removeErrorStyles(input);
    }

    if (input.classList.contains("card-number-input")) {
      const cardNumber = input.value.trim();
      if (!isValidCardNumber(cardNumber)) {
        isFormValid = false;
        addErrorStyles(
          input,
          "Invalid card number. Must be 16 digits separated by spaces"
        );
      } else {
        removeErrorStyles(input);
      }
    }

    if (input.classList.contains("cvv-input")) {
      const cvv = input.value.trim();
      if (!isValidCVV(cvv)) {
        isFormValid = false;
        addErrorStyles(input, "Invalid CVV. Must be 3 digits");
      } else {
        removeErrorStyles(input);
      }
    }

    if (input.classList.contains("card-holder-input")) {
      const cardHolder = input.value.trim();
      if (!isValidCardHolderName(cardHolder)) {
        isFormValid = false;
        addErrorStyles(input, "Invalid name. Only alphabets allowed");
      } else {
        removeErrorStyles(input);
      }
    }
  });

  return isFormValid;
}

async function handlePaymentFormSubmission(event) {
  event.preventDefault();

  const isFormValid = validatePaymentForm();
  if (isFormValid) {
    const paymentData = {
      cardNumber: paymentForm.querySelector(".card-number-input").value,
      cardHolder: paymentForm.querySelector(".card-holder-input").value,
      expMonth: paymentForm.querySelector(".month-input").value,
      expYear: paymentForm.querySelector(".year-input").value,
      cvv: paymentForm.querySelector(".cvv-input").value,
    };

    const orderData = {
      billingData: paymentData, // Adjust to match your server's expected structure
      shipping_address: {
        address: document.getElementById("Address").value,
        city: document.getElementById("City").value,
        state: document.getElementById("State").value,
        postal_code: document.getElementById("Zipcode").value,
      },
    };

    try {
      const response = await fetch("/user/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        showPopup("Checkout successful. Thank you for your purchase!");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2000 milliseconds (2 seconds) delay as an example
        window.location.href = "/user/shopAll";
      } else {
        showErrorPopup("Checkout failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during payment form submission:", error.message);
      showErrorPopup("Error during payment form submission");
    }
  }
}

function updateProgress(stepIndex) {
  const progress = document.querySelector(".progress");
  const steps = document.querySelectorAll(".step");

  // Update progress bar width
  progress.style.width = `${(stepIndex / (steps.length - 1)) * 100}%`;

  steps.forEach((step, index) => {
    if (index < stepIndex) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (index === stepIndex) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  });
}

// Example: Move to step 3 (Payment)
updateProgress(2);

function showPopup(message) {
  const popup = document.querySelector(".login-message-popup");
  const popupMessage = popup.querySelector("h2");
  popupMessage.textContent = message;

  // Show the popup
  popup.classList.add("show");

  // Automatically hide popup after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000); // Adjust timing as needed
}

function showErrorPopup(message) {
  const popup = document.getElementById("login-message-error-popup");
  const popupMessage = popup.querySelector("h2");
  popupMessage.textContent = message;

  // Show the popup
  popup.classList.add("show");

  // Automatically hide popup after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000); // Adjust timing as needed
}

// Function to add error styles
function addErrorStyles(input, message) {
  input.classList.add("invalid");
  input.style.borderColor = "red";
  let errorMessage = input.parentNode.querySelector(".error-message");
  if (!errorMessage) {
    errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.style.color = "red";
    errorMessage.textContent = message;
    input.parentNode.appendChild(errorMessage);
  }
}

// Function to remove error styles
function removeErrorStyles(input) {
  input.classList.remove("invalid");
  input.style.borderColor = ""; // Reset to default border color
  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Helper function to check if card number is valid (16 digits)
function isValidCardNumber(cardNumber) {
  return /^\d{16}$/.test(cardNumber.replace(/\s+/g, ""));
}

// Helper function to check if CVV is valid (3 digits)
function isValidCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

// Helper function to check if card holder name is valid (only alphabets)
function isValidCardHolderName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

// Attach event listener to payment form submit button
paymentForm.addEventListener("submit", handlePaymentFormSubmission);
