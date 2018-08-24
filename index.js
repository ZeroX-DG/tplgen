const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const packageFile = path.join(cwd, 'package.json');
const nodeModules = path.join(cwd, 'node_modules');

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

function generate(withDevDependencies) {
  const result = [];
  try {
    const packageData = fs.readFileSync(packageFile);
    const pkg = JSON.parse(packageData);
    const {dependencies} = pkg;
    for (const dependency of Object.keys(dependencies)) {
      const dependencyFolder = path.join(nodeModules, dependency);
      const license = getLicense(dependencyFolder);
      result.push({
        name: dependency,
        version: dependencies[dependency],
        license
      });
    }
    if (withDevDependencies) {
      const {devDependencies} = pkg;
      for (const dependency of Object.keys(devDependencies)) {
        const dependencyFolder = path.join(nodeModules, dependency);
        const license = getLicense(dependencyFolder);
        result.push({
          name: dependency,
          version: devDependencies[dependency],
          license
        });
      }
    }
  } catch (error) {
    throw error
  }
  return result;
}

function makeThirdPartyLicenseFile(licenseFile, withDevDependencies) {
  const result = generate(withDevDependencies);
  let writeData = 'This application bundles the following third-party packages in accordance'
  writeData += '\nwith the following licenses:\n'
  for (let i = 0; i < result.length; i++){
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
}

module.exports = makeThirdPartyLicenseFile;
