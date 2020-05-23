/* eslint-disable no-unused-vars */

import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import yellow from '@material-ui/core/colors/yellow';
import amber from '@material-ui/core/colors/amber';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';
import brown from '@material-ui/core/colors/brown';
import gray from '@material-ui/core/colors/grey';
import blueGray from '@material-ui/core/colors/blueGrey';

/* eslint-enable no-unused-vars */

const settings = {
  title: 'Klass.Live',

  theme: {
    primaryColor: {
      name: 'red',
      import: red
    },
    secondaryColor: {
      name: 'teal',
      import: teal
    },
    type: 'dark'
  },

  credentials: {
    firebase: {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL, 
      projectId: process.env.REACT_APP_PROJECT_ID, 
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET, 
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APPID
    }
  }
};

export default settings;

