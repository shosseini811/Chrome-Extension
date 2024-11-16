document.addEventListener('DOMContentLoaded', () => {
  const fillFormButton = document.getElementById('fillForm');
  
  if (!fillFormButton) {
    console.error('Fill Form button not found!');
    return;
  }

  fillFormButton.addEventListener('click', async () => {
    console.log('Fill Form button clicked!');
    
    try {
      const response = await fetch(chrome.runtime.getURL('resume.json'));
      const resumeData = await response.json();
      console.log('Resume data loaded:', resumeData);

      // Get the active tab
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      console.log('Active tab:', tab);
      console.log('Is the tab active?', tab.active);

      if (!tab) {
        console.error('No active tab found');
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, {
        action: "fillForm",
        data: resumeData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          return;
        }
        console.log('Response from content script:', response);
      });

    } catch (error) {
      console.error('Error in fill form process:', error);
    }
  });
});

// Logs a message when the service worker is activated
self.addEventListener('activate', (event) => {
  console.log('Background service worker has been activated.');
});

// Optional: Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'backgroundAction') {
    // Handle specific background actions here
    console.log('Received a message from another part of the extension:', request.data);
    // You can perform background tasks based on the request
    sendResponse({ status: 'Background action handled successfully.' });
  }
});
