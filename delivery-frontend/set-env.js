const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';

const apiUrl = process.env.API_URL || 'http://localhost:8080/api';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
  console.log(`API_URL usada: ${apiUrl}`);
});