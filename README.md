# Job Application Auto-Filler Chrome Extension

This Chrome extension helps you automatically fill out job application forms using your embedded resume data.

## Features

- Automatically fills form fields with your resume information.
- Streamlined for personal use with embedded resume data.
- Saves time by eliminating repetitive form filling.

## Installation

1. **Clone or Download** this repository to your local machine.

    ```bash
    https://github.com/shosseini811/Chrome-Extension.git
    ```

2. **Verify `resume.json`**: Ensure your `resume.json` is correctly placed in the extension directory.

3. **Open Chrome** and navigate to `chrome://extensions/`.

4. **Enable "Developer mode"** by toggling the switch in the top-right corner.

5. **Load the Extension**:

    - Click on "Load unpacked".
    - Select the cloned or downloaded `chrome-extension-job-filler` directory.

6. **Confirm Installation**: The extension icon should appear in the Chrome toolbar.

## Usage

1. **Navigate to a Job Application Form** on your desired website.

2. **Click the Extension Icon** in the Chrome toolbar.

3. **Fill the Form**:

    - In the popup, click the "Fill Form" button.
    - The extension will automatically populate the form fields with your resume data.

4. **Review and Submit**: Ensure all fields are correctly filled before submitting the application.

## Customization

If you need to update your resume data, modify the `resume.json` file in the extension directory and reload the extension:

1. **Edit `resume.json`**: Update your resume information as needed.

2. **Reload the Extension**:

    - Navigate to `chrome://extensions/`.
    - Find the "Job Application Auto-Filler" extension.
    - Click the "Reload" icon.

## Contributing

This extension is tailored for personal use. However, if you wish to contribute or suggest enhancements, feel free to open an issue or submit a pull request.

## License

[MIT](LICENSE)