const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const nodeModules = path.join(cwd, 'node_modules');
let packageLoss = 0;

function getLicense(dependencyFolder) {
  const licenseFiles = [
    'LICENSE',
    'LICENSE.txt',
    'LICENSE.md',
    'license',
    'license.txt',
    'license.md'
  ];
  const packageFile = path.join(dependencyFolder, 'package.json');
  const packageFileContent = fs.readFileSync(packageFile);
  const packageFileData = JSON.parse(packageFileContent);
  let licenseSource = null;
  let licenseText = null;
  let license = null;
  for (let i = 0; i < licenseFiles.length; i++) {
    const file = licenseFiles[i];
    const licenseFilePath = path.join(dependencyFolder, file);
    if (fs.existsSync(licenseFilePath)) {
      licenseSource = file;
      licenseText = fs.readFileSync(licenseFilePath);
      license = packageFileData.license;
      return {
        name: license,
        source: licenseSource,
        sourceText: licenseText
      };
    }
  }
  return {
    name: packageFileData.license,
    source: 'package.json'
  };
}

function generate(cwd, withDevDependencies, depOfdep) {
  let result = [];
  try {
    const packageFile = path.join(cwd, 'package.json');
    const packageData = fs.readFileSync(packageFile);
    const pkg = JSON.parse(packageData);
    const {dependencies} = pkg;
    const dependencyNames = dependencies ? Object.keys(dependencies) : []
    for (const dependency of dependencyNames) {
      const dependencyFolder = path.join(nodeModules, dependency);
      const license = getLicense(dependencyFolder);
      result.push({
        name: dependency,
        version: dependencies[dependency],
        license
      });
      if (depOfdep) {
        result = result.concat(generate(dependencyFolder, withDevDependencies, depOfdep))
      }
    }
    if (withDevDependencies) {
      const {devDependencies} = pkg;
      const dependencyNames = dependencies ? Object.keys(devDependencies) : []
      for (const dependency of dependencyNames) {
        const dependencyFolder = path.join(nodeModules, dependency);
        const license = getLicense(dependencyFolder);
        result.push({
          name: dependency,
          version: devDependencies[dependency],
          license
        });
        if (depOfdep) {
          result = result.concat(generate(dependencyFolder, withDevDependencies, depOfdep))
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    } else {
      // some package is in a special node_modules
      // like minimist located in electron-download/node_modules
      packageLoss++
    }
  }
  return result;
}

function makeThirdPartyLicenseFile(licenseFile, withDevDependencies, depOfdep) {
  console.time(' ● Finished after');
  const result = generate(cwd, withDevDependencies, depOfdep);
  let writeData = 'This application bundles the following third-party packages in accordance'
  writeData += '\nwith the following licenses:\n'
  const totalPackages = result.length
  for (let i = 0; i < totalPackages; i++){
    const dependency = result[i]
    writeData += `${'-'.repeat(73)}\n`;
    writeData += `Package: ${dependency.name}@${dependency.version}\n`;
    writeData += `License: ${dependency.license.name}\n`;
    writeData += `License Source: ${dependency.license.source}\n`;
    if (dependency.license.sourceText) {
      writeData += `\nSourceText:\n\n`;
      writeData += dependency.license.sourceText;
      writeData += '\n'
    }
  };
  fs.writeFileSync(licenseFile, writeData);
  console.log(' ----- Result -----');
  console.log(` ● ${totalPackages} package licenses added`)
  console.log(` ● ${packageLoss} packages loss`)
  console.timeEnd(' ● Finished after');
}

module.exports = makeThirdPartyLicenseFile;
