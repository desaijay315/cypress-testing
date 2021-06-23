
// const browsers =  [{name: 'internet explorer', version: '10'}, {name:'edge', version: '40'}, {name:'chrome', version: '100'}, {name: 'firefox', version: '85'}, {name:'safari', version: '14'}]
// metadata:{
//     browser: {
//         name:  `${browser.version}`,
//         version: '100'
//     },
//     device: 'Local test machine',
//     platform: {
//         name: 'ubuntu',
//         version: '16.04'
//     }
// },
// customData: {
//     title: 'Run info',
//     data: [
//         {label: 'Project', value: 'Custom project'},
//         {label: 'Release', value: '1.2.3'},
//         {label: 'Cycle', value: 'B11221.34321'},
//         {label: 'Execution Start Time', value: 'Nov 19th 2022, 02:31 PM EST'},
//         {label: 'Execution End Time', value: 'Nov 19th 2017, 02:56 PM EST'}
//     ]
// }
// browsers.forEach(browser => {
    // setTimeout(() => {})
    // report.generate({
    //     jsonDir: './cypress/cucumber-json',
    //     reportPath: './mochawesome-report/cucumber-report',
    //     reportName: 'Report: Blog Site',
    //     saveCollectedJSON: true,
    //     customMetadata: false,
    //     displayDuration: true,
    //     openReportInBrowser: true,
    //     disableLog: true,
    //     displayDuration: true,
    //     hideMetadata: false,
    //     displayReportTime: true,
    //     durationInMS: true,
    //     customData: {
    //         title: 'Run info',
    //         data: [
    //             {label: 'Project', value: 'Blog Site'},
    //             {label: 'Release', value: 'REL'},
    //             {label: 'Backend', value: 'api.com'},
    //             {label: 'Frontend', value: 'web'},
    //             {label: 'Cycle', value: 'B11221.34321'},
    //             {label: 'Execution Start Time', value: 'XYZ'},
    //             {label: 'Execution End Time', value: (new Date).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
    //         ]
    //     }
    // });
// })


//#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const report = require('multiple-cucumber-html-reporter');


const cucumberJsonDir = './cypress/cucumber-json';
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;
const htmlReportDir = './mochawesome-report/cucumber-report';
const screenshotsDir = './cypress/screenshots';

const getCucumberReportMaps = () => {
  const files = fs.readdirSync(cucumberJsonDir).filter(file => file.indexOf('.json') > -1);
  files.forEach(file => {
    const json = JSON.parse(
      fs.readFileSync(path.join(cucumberJsonDir, file)),
    );
    if (!json[0]) { return; }
    const [feature] = json[0].uri.split('/').reverse();
    cucumberReportFileMap[feature] = file;
    cucumberReportMap[feature] = json;
  });
};

const addScreenshots = () => {
  // Prepend the given path segment
  const prependPathSegment = pathSegment => location => path.join(pathSegment, location);
  // fs.readdir but with relative paths
  const readdirPreserveRelativePath = location => fs.readdirSync(location).map(prependPathSegment(location));
  // Recursive fs.readdir but with relative paths
  const readdirRecursive = location => readdirPreserveRelativePath(location)
    .reduce((result, currentValue) => fs.statSync(currentValue).isDirectory()
      ? result.concat(readdirRecursive(currentValue))
      : result.concat(currentValue), []);
  const screenshots = readdirRecursive(path.resolve(screenshotsDir)).filter(file => file.indexOf('.png') > -1);
  // Extract feature list from screenshot list
  const featuresList = Array.from(new Set(screenshots.map(x => x.match(/[\w-_.]+\.feature/g)[0])));
  featuresList.forEach((feature) => {
    screenshots.forEach(screenshot => {
      // regex to parse 'I can use scenario outlines with examples' from either of these:
      //   - Getting Started -- I can use scenario outlines with examples (example #1) (failed).png
      //   - Getting Started -- I can use scenario outlines with examples (failed).png
      //   - Getting Started -- I can use scenario outlines with examples.png
      const regex = /(?<=--\ ).+?((?=\ \(example\ #\d+\))|(?=\ \(failed\))|(?=\.\w{3}))/g;
      const [scenarioName] = screenshot.match(regex);
      // eslint-disable-next-line no-console
      console.info(chalk.blue('\n    Adding screenshot to cucumber-json report for'));
      // eslint-disable-next-line no-console
      console.info(chalk.blue(`    '${ scenarioName }'`));
      // Find all scenarios matching the scenario name of the screenshot.
      // This is important when using the scenario outline mechanism
      const myScenarios = cucumberReportMap[feature][0].elements.filter(
        e => scenarioName.includes(e.name),
      );
      if (!myScenarios) { return; }
      let foundFailedStep = false;
      myScenarios.forEach(myScenario => {
        if (foundFailedStep) {
          return;
        }
        let myStep;
        if (screenshot.includes('(failed)')) {
          myStep = myScenario.steps.find(
            step => step.result.status === 'failed',
          );
        } else {
          myStep = myScenario.steps.find(
            step => step.name.includes('screenshot'),
          );
        }
        if (!myStep) {
          return;
        }
        const data = fs.readFileSync(
          path.resolve(screenshot),
        );
        if (data) {
          const base64Image = Buffer.from(data, 'binary').toString('base64');
          if (!myStep.embeddings) {
            myStep.embeddings = [];
            // eslint-disable-next-line @typescript-eslint/naming-convention
            myStep.embeddings.push({ data: base64Image, mime_type: 'image/png' });
            foundFailedStep = true;
          }
        }
      });
      //Write JSON with screenshot back to report file.
      fs.writeFileSync(
        path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
        JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel),
      );
    });
  });
};

const generateReport = () => {
  if (!fs.existsSync(cucumberJsonDir)) {
    console.warn(chalk.yellow(`WARNING: Folder './${ cucumberJsonDir }' not found. REPORT CANNOT BE CREATED!`));
  } else {
    report.generate({
      jsonDir: cucumberJsonDir,
      reportPath: htmlReportDir,
      displayDuration: true,
      pageTitle: 'System-Test Report',
      reportName: `System-Test Report - ${ new Date().toLocaleString() }`,
      openReportInBrowser: true,
      metadata: {
        browser: {
          name: 'chrome',
        },
        device: 'Desktop',
        platform: {
          name: 'windows',
        },
      },
    });
  }
};

getCucumberReportMaps();
addScreenshots();
generateReport();