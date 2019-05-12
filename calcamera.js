const Onvif = require('onvif');

require('onvif-snapshot');

const request = require('request');

const subscriptionKey = 'cd70df9559464e2bbef96d582c00461a';

const uriBase = 'http://northeurope.api.cognitive.microsoft.com/face/v1.0/detect';

const deepstream = require('deepstream.io-client-js')

const client = deepstream('localhost:6020').login();

var url = '192.168.0.12';

var intervalObj;

function  takeSnapshop(){ 
    const Cam = new Onvif.Cam({
        hostname: url,
        port: 8080,
        username: '1111',
        password: '1111'

    },
        function (err) {
            if (err) throw err;
            this.getSnapshot((err, data) => {
                if (err) throw err;
                const imageUrl = data.rawImage;
                const params = {
                    'returnFaceId': 'true',
                    'returnFaceLandmarks': 'false',
                    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                     'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
                };

                const options = {
                    uri: uriBase,
                    qs: params,
                    body: imageUrl,
                    headers: {
                        'Content-Type': 'application/octet-stream', 
                        'Ocp-Apim-Subscription-Key': subscriptionKey
                    }
                };
                request.post(options, (error, response, body) => {
                    if (error) {
                        console.log('Error: ', error);
                        return error;
                    }
                    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                    // console.log('JSON Response\n');
                    console.log('emotion', jsonResponse);
                    client.event.emit('posts-event', jsonResponse);
                })
            })
        });       
}
   
client.event.subscribe('posts-event1', function  (eventData) {
    if (eventData.status == 'true') {
        console.log('deepstream: status', eventData.status);
        client.event.emit('posts-event1', { data: eventData.status });

        intervalObj = setInterval(takeSnapshop, 5000);

    } else {
        clearInterval(intervalObj);
        console.log('deepstream: status',eventData.status);    
    }
    });






















// function intervalFunc() {
// const Cam = new Onvif.Cam({
//     hostname: '192.168.88.24',
//     port: 8080,
//     username: '1111',
//     password: '1111'

// }, 
//  function  (err) {
//     if (err) throw err;

//      this.getSnapshot((err, data) => {
//         if (err) throw err;
//         console.log('rawimage', data.rawImage);

//     const imageUrl = data.rawImage;

// console.log('eeeee',imageUrl);

//     const params = {
//         'returnFaceId': 'true',
//         'returnFaceLandmarks': 'false',
//         'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
//             'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
//     };

//     const options = {
//         uri: uriBase,
//         qs: params,
//         body: imageUrl,
//         headers: {
//             'Content-Type': 'application/octet-stream',
//             'Ocp-Apim-Subscription-Key': subscriptionKey
//         }
//     };
//     request.post(options, (error, response, body) => {
//         if (error) {
//             console.log('Error: ', error);
//             return;
//         }
//         let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
//         console.log('JSON Response\n');
//         console.log(jsonResponse);
//         client.event.emit('posts-event', jsonResponse);
//     })
// })
// }); 
// }
// setInterval(intervalFunc, 5000);