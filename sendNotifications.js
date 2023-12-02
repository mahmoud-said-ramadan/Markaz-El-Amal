// sendNotification.js

import { admin } from './adminFirebase.js' // Import the Firebase Admin configuration and object

// Define the sendNotification function
const sendNotification = (recipientToken, { title, body }) => {
  console.log(recipientToken, { title, body })
  console.log('---------------------------------------------------------------------------');
  console.log('Recipient Token:', recipientToken) // Log the token for debugging

  if (!recipientToken) {
    console.error('Invalid recipient token. Message not sent.')
    return
  }
  const message = {
    notification: {
      title: title,
      body: body
    },
    data: {
      customKey: 'customValue' // You can include custom data here
    },
    token: recipientToken
  }

  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log('Successfully sent message:', response)
      
    })
    .catch(error => {
      console.error('Error sending message:', error)
    })
}

export default sendNotification

// import { admin } from './adminFirebase.js'; // Import Firebase Admin configuration and object
// // import { messaging, firebaseApp } from './firebase.js'; // Import Firebase Web configuration and 'messaging' object

// // Use Firebase Admin for server-side notifications
// const message = {
//   notification: {
//     title: 'New Message', // Title of the notification
//     body: 'You have a new message from John.', // Message content
//   },
//   data: {
//     customKey: 'customValue', // You can include custom data here
//   },
//   token: 'FCM_TOKEN', // The FCM token of the recipient device
// };

// admin.messaging()
//   .send(message)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.error('Error sending message:', error);
//   });
