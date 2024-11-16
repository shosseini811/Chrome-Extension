console.log('Content script loaded at:', window.location.href);
document.documentElement.setAttribute('data-extension-loaded', 'true');

console.log('Content script loaded!');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  
  if (request.action === "fillForm") {
    console.log('Fill form action received with data:', request.data);
    fillJobApplicationForm(request.data);
    sendResponse({status: 'Form fill attempted'});
  }
  return true; // Keep the message channel open for async response
});

function fillJobApplicationForm(data) {
  console.log('Attempting to fill form with data:', data);
  
  // Log all input fields on the page
  const allInputs = document.querySelectorAll('input, textarea, select');
  console.log('Found form fields:', allInputs.length);
  
  allInputs.forEach(input => {
    console.log('Field:', {
      type: input.type,
      name: input.name,
      id: input.id,
      value: input.value
    });
  });

  // Add field mapping
  const fieldMapping = {
    name: 'input[name="name"]',
    email: 'input[name="email"]',
    phone: 'input[name="phone"]',
    linkedin: 'input[name="urls[LinkedIn]"]',
    github: 'input[name="urls[GitHub]"]',
    location: '#location-input',
    company: 'input[name="org"]'
  };

  // Update field filling logic
  for (const [key, selector] of Object.entries(fieldMapping)) {
    const field = document.querySelector(selector);
    if (field && data[key]) {
      field.value = data[key];
      // Trigger change event to ensure form validation runs
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

// Add LinkedIn API error handling
const handleLinkedInError = (error) => {
  console.warn('LinkedIn API error:', error);
  // Fallback to manual form filling if LinkedIn fails
  fillFormManually(data);
};

// Update LinkedIn button click handler
document.querySelector('.awli-button').addEventListener('click', (e) => {
  try {
    // ... existing LinkedIn code ...
  } catch (error) {
    handleLinkedInError(error);
  }
});

// Add captcha handling
const waitForCaptcha = () => {
  return new Promise((resolve) => {
    const checkCaptcha = setInterval(() => {
      const captchaResponse = document.getElementById('hcaptchaResponseInput').value;
      if (captchaResponse) {
        clearInterval(checkCaptcha);
        resolve(captchaResponse);
      }
    }, 500);
  });
};

// Update form submission
const submitForm = async () => {
  try {
    await waitForCaptcha();
    document.getElementById('btn-submit').click();
  } catch (error) {
    console.error('Form submission error:', error);
  }
};
