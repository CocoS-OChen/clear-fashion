const fs = require('fs');
const sandboxx = require('./sandbox');

fs.readFile('navLinksMon.json', (err, data) => {
  if (err) throw err;

  const navLinksArray = JSON.parse(data);

  navLinksArray.forEach((link => {
    sandboxx.sandbox(link)
        }));
    });

    
/*fs.readFile('navLinksDed.json', (err, data) => {
  if (err) throw err;

  const navLinksArray = JSON.parse(data);

  navLinksArray.forEach((link => {
    sandboxx.sandbox(link)
        }));
    });

    fs.readFile('navLinksCircle.json', (err, data) => {
  if (err) throw err;

  const navLinksArray = JSON.parse(data);

  navLinksArray.forEach((link => {
    sandboxx.sandbox(link)
        }));
    });
    // fonctionne pas circle je n'arrive pas à sortir les links de navifation 
    