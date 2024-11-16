console.log('Content script loaded at:', window.location.href);
document.documentElement.setAttribute('data-extension-loaded', 'true');

console.log('Content script loaded!');

// Helper function to safely get field value
const getFieldValue = (data, field) => data[field] || '';
console.log('getFieldValue:', getFieldValue);
// Helper function to set field value and trigger change event
const setFieldValue = (element, value) => {
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const fillGreenhouseForm = (data) => {
  // Map data to Greenhouse field IDs
  const fieldMapping = {
    first_name: getFieldValue(data.name, 'first_name') || data.name.split(' ')[0],
    last_name: getFieldValue(data.name, 'last_name') || data.name.split(' ').slice(1).join(' '),
    name: data.name,
    email: data.email,
    phone: data.phone,
  };

  // Fill each field
  Object.entries(fieldMapping).forEach(([id, value]) => {
    const field = document.getElementById(id);
    setFieldValue(field, value);
  });

  // Handle file upload fields if needed
  const resumeField = document.getElementById('resume');
  const coverLetterField = document.getElementById('cover_letter');
  
  // Log successful fill
  console.log('Greenhouse form fields filled successfully');
};

// Main message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    console.log('Message received in content script:', message);
    console.log('Fill form action received with data:', message.data);
    
    try {
      // Generic form fill logic that works across different job sites
      const commonFormFields = {
        // Common field identifiers and their variations
        firstName: ['first_name', 'firstname', 'fname', 'given-name', 'givenName'],
        lastName: ['last_name', 'lastname', 'lname', 'family-name', 'familyName'],
        email: ['email', 'email-address', 'emailAddress'],
        phone: ['phone', 'telephone', 'mobile', 'phone-number', 'phoneNumber'],
        linkedin: ['linkedin', 'linkedin-url', 'linkedinUrl', 'linkedin_profile']
      };

      // Generic form fill function
      fillApplicationForm(message.data, commonFormFields);
      sendResponse({ status: 'Form fill attempted' });
    } catch (error) {
      console.error('Error filling form:', error);
      sendResponse({ status: 'Error', error: error.message });
    }
    
    return true; // Keep the message channel open for async response
  }
});

// Helper function to find field by label text
const findFieldByLabel = (labelText) => {
  // Find all labels containing the text (case insensitive)
  const labels = Array.from(document.querySelectorAll('label')).filter(label => 
    label.textContent.toLowerCase().includes(labelText.toLowerCase())
  );
  
  // For each matching label, try to find its associated input
  for (const label of labels) {
    // Try to find input by 'for' attribute
    if (label.htmlFor) {
      const input = document.getElementById(label.htmlFor);
      if (input) return input;
    }
    
    // If no 'for' attribute or input not found, look for input within the label
    const input = label.querySelector('input') || 
                 // Also look for the next input after the label
                 label.nextElementSibling?.querySelector('input') ||
                 label.nextElementSibling;
                 
    if (input) return input;
  }
  return null;
};

// Add patterns to identify different types of questions
const questionPatterns = {
    workAuthorization: [
        'authorized to work',
        'work authorization',
        'legally authorized',
        'legal right to work'
    ],
    sponsorship: [
        'require visa sponsorship',
        'require sponsorship',
        'need visa',
        'visa sponsorship'
    ]
};

// Modified handleYesNoButtons function
const handleYesNoButtons = (labelText) => {
    // Find the label containing the text
    const labels = Array.from(document.querySelectorAll('label')).filter(label => {
        const text = label.textContent.toLowerCase();
        
        // Check what type of question this is
        if (questionPatterns.workAuthorization.some(pattern => text.includes(pattern))) {
            console.log('Found work authorization question');
            return true;
        }
        
        if (questionPatterns.sponsorship.some(pattern => text.includes(pattern))) {
            console.log('Found sponsorship question');
            return true;
        }
        
        return false;
    });

    if (labels.length > 0) {
        labels.forEach(label => {
            const text = label.textContent.toLowerCase();
            console.log('Processing label:', label.textContent);
            
            // Determine the correct answer based on question type
            let answer = 'No';  // Default
            if (questionPatterns.workAuthorization.some(pattern => text.includes(pattern))) {
                answer = 'Yes';
            }
            
            // Find and click the appropriate button
            const buttonContainer = label.nextElementSibling;
            if (buttonContainer) {
                const buttons = buttonContainer.querySelectorAll('button');
                const targetButton = Array.from(buttons).find(button => 
                    button.textContent.trim().toLowerCase() === answer.toLowerCase()
                );
                
                if (targetButton) {
                    console.log(`Clicking ${answer} button for: ${label.textContent}`);
                    targetButton.click();
                }
            }
        });
    }
};

// Helper function to handle resume upload
const handleResumeUpload = async (resumePath) => {
    // Find the file input for resume
    const resumeInput = document.querySelector('input[type="file"][id="resume"], input[type="file"][accept*=".pdf"]');
    
    if (resumeInput) {
        try {
            // Create a File object from your resume
            const response = await fetch(resumePath);
            const blob = await response.blob();
            const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
            
            // Create a DataTransfer object to set the file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            resumeInput.files = dataTransfer.files;
            
            // Trigger change event
            resumeInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('Resume uploaded successfully');
        } catch (error) {
            console.error('Error uploading resume:', error);
        }
    } else {
        console.log('Resume input not found');
    }
};

// Generic form filling logic
const fillApplicationForm = async (data) => {
  // Basic field patterns to look for
  const fieldPatterns = {
    first_name: ['first name', 'firstname', 'given name'],
    last_name: ['last name', 'lastname', 'family name', 'surname'],
    email: ['email', 'e-mail'],
    phone: ['phone', 'telephone', 'mobile', 'cell'],
    linkedin: ['linkedin', 'linked in', 'linkedin profile', 'linkedin url'],
    sponsorship: ['require sponsorship', 'sponsorship required', 'visa sponsorship']
  };

  // Fill each basic field
  Object.entries(fieldPatterns).forEach(([fieldType, patterns]) => {
    // Try to find field by ID or name first
    let field = document.getElementById(fieldType) || 
                document.querySelector(`input[name*="${fieldType}" i]`);
    
    // If not found, try to find by label text
    if (!field) {
      for (const pattern of patterns) {
        field = findFieldByLabel(pattern);
        if (field) break;
      }
    }

    // If field found, set its value
    if (field) {
      if (field.closest('.select__container')) {
        setSelectValue(field, 'No');
      } else {
        const value = fieldType === 'first_name' ? 
          (getFieldValue(data.name, 'first_name') || data.name.split(' ')[0]) :
          fieldType === 'last_name' ? 
          (getFieldValue(data.name, 'last_name') || data.name.split(' ').slice(1).join(' ')) :
          data[fieldType];

        setFieldValue(field, value);
      }
    }
  });

  // Handle file upload fields
  const resumeField = document.getElementById('resume') || 
                     document.querySelector('input[type="file"][name*="resume" i]') ||
                     findFieldByLabel('resume');
  const coverLetterField = document.getElementById('cover_letter') || 
                          document.querySelector('input[type="file"][name*="cover" i]') ||
                          findFieldByLabel('cover letter');
  
  console.log('Application form fields filled successfully');

  // Handle sponsorship question specifically
  handleReactSelect('require sponsorship', 'No');

  // This will handle both types of questions
  handleYesNoButtons();

  // Handle resume upload if path is provided in data
  if (data.resumePath) {
    await handleResumeUpload(data.resumePath);
  }
};

// Function to find an input field by looking at label text
function findLinkedInField() {
    console.log('Looking for LinkedIn field...');
    
    const labels = document.querySelectorAll('label');
    console.log('Found', labels.length, 'labels on the page');
    
    for (const label of labels) {
        console.log('Checking label:', label.textContent);
        
        if (label.textContent.includes('LinkedIn')) {
            console.log('Found LinkedIn label!');
            
            const inputId = label.getAttribute('for');
            console.log('Input ID from label:', inputId);
            
            const inputField = document.getElementById(inputId);
            console.log('Found input field:', inputField);
            
            return inputField;
        }
    }
}

// Add this new helper function
const setSelectValue = (element, value) => {
  if (element) {
    // Find the select container
    const selectContainer = element.closest('.select__container');
    if (!selectContainer) return;

    // Click to open dropdown
    const button = selectContainer.querySelector('button');
    if (button) button.click();

    // Small delay to let dropdown open
    setTimeout(() => {
      // Find and click the "No" option
      const options = document.querySelectorAll('[role="option"]');
      const noOption = Array.from(options).find(opt => 
        opt.textContent.toLowerCase() === 'no'
      );
      if (noOption) noOption.click();
    }, 100);
  }
};

// Add this new helper function for React select components
const handleReactSelect = (labelText, value) => {
  // Find the label containing the text
  const labels = Array.from(document.querySelectorAll('label')).filter(label => 
    label.textContent.toLowerCase().includes(labelText.toLowerCase())
  );

  if (labels.length > 0) {
    const label = labels[0];
    const inputId = label.getAttribute('for');
    
    if (inputId) {
      // Find the input and its container
      const input = document.getElementById(inputId);
      const container = input?.closest('.select__container');
      
      if (container && input) {
        // Click to open the dropdown
        const button = container.querySelector('button');
        if (button) {
          button.click();
          
          // Wait for dropdown to open and then click "No"
          setTimeout(() => {
            // Simulate typing "No" into the input
            input.value = "No";
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Wait briefly and then press Enter
            setTimeout(() => {
              input.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true
              }));
            }, 100);
          }, 100);
        }
      }
    }
  }
};
