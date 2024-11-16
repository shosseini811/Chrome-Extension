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
