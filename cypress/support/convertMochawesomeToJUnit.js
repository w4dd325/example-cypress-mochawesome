import fs from "fs";
import path from 'path';
import xmlbuilder from "xmlbuilder";

const convertMochawesomeToJUnit = (mochawesomeJsonPath, outputXmlPath) => {
  // Ensure the directory for the output XML exists
  const outputDir = path.dirname(outputXmlPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  // Read and parse the Mochawesome JSON file
  const mochawesomeData = JSON.parse(
    fs.readFileSync(mochawesomeJsonPath, "utf8")
  );

  // Create the root element for the JUnit XML
  const testsuite = xmlbuilder
    .create("testsuite", { encoding: "UTF-8" })
    .att("name", "Mochawesome Tests")
    .att("tests", mochawesomeData.stats.tests)
    .att("failures", mochawesomeData.stats.failures)
    .att("errors", mochawesomeData.stats.failures)
    .att("time", (mochawesomeData.stats.duration / 1000).toFixed(2));

  // Process each test result and add it to the testsuite
  mochawesomeData.results.forEach((testResult) => {
    testResult.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        const testcase = testsuite.ele("testcase", {
          classname: suite.title || "No Classname",
          name: suite.title + ' - ' + test.title || "No Test Name",
          time: (test.duration / 1000).toFixed(2),
        });

        if (test.state === "failed") {
          testcase.ele("failure", {}, test.err.message || "Test failed");
        }
      });
    });
  });

  // Generate the XML and write it to the output file
  const xml = testsuite.end({ pretty: true });
  fs.writeFileSync(outputXmlPath, xml);
  console.log(`JUnit XML written to: ${outputXmlPath}`);
};

// Usage
//const mochawesomeJsonPath = "./cypress/results/mochawesome.json"; // Replace with your file path
const mochawesomeJsonPath = "mochawesome.json";
const outputXmlPath = "./cypress/xml_output/junit.xml"; // Replace with your desired output path

convertMochawesomeToJUnit(mochawesomeJsonPath, outputXmlPath);
