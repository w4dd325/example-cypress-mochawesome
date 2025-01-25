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