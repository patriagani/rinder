function translate(obj, languageCode) {
  return new Promise(function(resolve, reject) {
    // Imports the Google Cloud client library
    const {Translate} = require('@google-cloud/translate');

    // Your Google Cloud Platform project ID
    const projectId = 'e-commerce-1524237061322' ;

    // Instantiates a client
    const translate = new Translate({
      projectId: projectId,
      keyFilename: 'e-commerce-1524237061322-f340e46f1842.json'
    });

    // The text to translate
    const text = obj.message;
    // The target language
    const target = languageCode;

    // Translates some text into Russian
    translate
      .translate(text, target)
      .then(results => {
        const translation = results[0];
        obj.message = translation
        resolve(obj)
      })
      .catch(err => {
        reject('ERROR:', err);
      });
  })
}

module.exports = translate