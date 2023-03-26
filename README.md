# databricks-if-attach-then-run
This project contains a sample Tampermonkey script to allow user to customize notebook command to run when a cluster attach event happens on the Notebook UI on their browser.

## Use Cases
- Allow your user to set the default catalogs / schemas whenever a notebook is created and attached to a cluster
- Install libraries automatically at Notebook-level
- Run init scripts at user-level across different clusters

![example_use_case](https://github.com/flyws/databricks-if-attach-then-run/blob/main/example.gif?raw=true)

## Prerequisites

To use this script, you will need:

1. A web browser that supports userscripts (e.g., Google Chrome, Mozilla Firefox)
2. Tampermonkey browser extension installed

## Installation

1. Open the Tampermonkey dashboard by clicking on the Tampermonkey icon in your browser and selecting "Dashboard."
2. Click on the "+" icon (or "Create a new script" button) to create a new userscript.
3. Replace the default content of the editor with the content of the `attach-and-run.js` file from this repository.
4. Customize the target payload, second payload, and any other settings in the script as needed.
5. Save the script by clicking the floppy disk icon (or "File" > "Save").

## Usage

1. Navigate to your Databricks workspace that matches the URL patterns specified in the script.
2. The script will automatically monitor the requests and trigger the specified payload based on the conditions defined in the script.
3. Open the browser's console to view logs and debug information, if needed.

## Customization

To customize the script, you can modify the following variables in the `attach-and-run.js` file:

- `targetPayload`: The request payload to look for in order to trigger the second payload.
- `targetPayload2`: An optional second request payload to look for in order to trigger the second payload. The default second payload will monitor the notebook creation event.
- `secondPayload`: The payload to send when the target payload (or target payload 2) is detected.

You may also want to update the `@match` rules in the script's metadata block if you want the script to run on different URL patterns.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Disclaimer

Please note that this script is a temporary solution and might have limitations due to security constraints in the browser and unexpected effects on your verbose audit log. Use this script at your own risk.
