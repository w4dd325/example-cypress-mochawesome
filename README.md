# example-cypress-
An example project showing how to setup Mochawesome

Assuming you already have Cypress installed... 

## Install the foillowing packages:
```npm install mochawesome --save-dev```  
```mochawesome-merge```  
```mochawesome-report-generator```  

## Configure the config
```Javascript
import { defineConfig } from "cypress";
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async () => {
        try {
          // Merge JSON files into mochawesome.json
          const mergeCommand = 'npx mochawesome-merge ./cypress/results/*.json -o mochawesome.json';
          console.log('Merging test result JSON files...');
          const mergeResult = await execPromise(mergeCommand);
          console.log(mergeResult.stdout);
          console.error(mergeResult.stderr);
          // Generate the report
          const reportCommand = 'npx marge mochawesome.json';
          console.log('Generating the report...');
          const reportResult = await execPromise(reportCommand);
          console.log(reportResult.stdout);
          console.error(reportResult.stderr);
        } catch (error) {
          console.error('Error during after:run hook:', error);
        }
      });
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: false,
      json: true,
    }
  }
});
```

## Setup a script to run the test with the report
```JSON
"scripts": {
    "test-with-report": "(cypress run --reporter mochawesome || true) && npx mochawesome-merge ./cypress/results/*.json -o mochawesome.json && npx marge mochawesome.json",
    "clean:cypress": "if exist cypress\\results rmdir /s /q cypress\\results && if exist mochawesome-report rmdir /s /q mochawesome-report && if exist mochawesome.json del mochawesome.json"
  },
```

## Run the test
```bash
npm run test-with-report
```
![image](https://github.com/user-attachments/assets/e35605e1-1fa3-453a-8d0c-b5f968027564)
