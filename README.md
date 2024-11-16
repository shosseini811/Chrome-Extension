# Job Application Auto-Filler Chrome Extension

A Chrome extension that automatically fills out job application forms with your resume data, handles common application questions, and uploads your resume.

## Features

- **Auto-fill Basic Information:**
  - First Name
  - Last Name
  - Email
  - Phone Number
  - LinkedIn URL

- **Handle Common Application Questions:**
  - Work Authorization (Automatically answers "Yes" to questions like "Are you authorized to work in the U.S.?")
  - Visa Sponsorship (Automatically answers "No" to questions like "Will you require sponsorship?")
  - Other Yes/No questions based on configured patterns

- **Resume Upload:**
  - Automatically uploads your resume file
  - Supports PDF, DOC, DOCX, TXT, RTF formats
  - Works with direct file upload buttons

## Installation

1. **Clone the Repository:**
   ```bash
   git clone [repository-url]
   cd job-application-auto-filler
   ```

2. **Add Your Resume:**
   - Create an `assets` folder in the extension directory
   - Add your resume file (e.g., `resume.pdf`) to the `assets` folder

3. **Configure Your Information:**
   Create a `resume.json` file in the extension directory with your information:
   ```json
   {
     "name": {
       "first_name": "Your First Name",
       "last_name": "Your Last Name"
     },
     "email": "your.email@example.com",
     "phone": "Your Phone Number",
     "linkedin": "Your LinkedIn URL",
     "resumePath": "assets/resume.pdf"
   }
   ```

4. **Load the Extension:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

## Usage

1. **Navigate** to a job application page

2. **Click** the extension icon in your Chrome toolbar

3. **Click** the "Fill Form" button
   - The extension will automatically:
     - Fill in your basic information
     - Answer common questions
     - Upload your resume

4. **Review** all filled information before submitting

## Supported Job Platforms

The extension is designed to work with various job application platforms and handles:
- Different field identification methods (ID, name, label text)
- React-based select components
- Yes/No button questions
- File upload fields

## Customization

### Modifying Question Patterns

Edit the question patterns in `content.js` to match specific application forms:

```javascript
const questionPatterns = {
    
}
```

## Contributing

This extension is tailored for personal use. However, if you wish to contribute or suggest enhancements, feel free to open an issue or submit a pull request.

## License

[MIT](LICENSE)