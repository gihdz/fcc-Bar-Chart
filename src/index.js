import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';


// import postscribe from 'postscribe';

// const le = document.getElementById("my-fcc-test-suite");
// const script = document.createElement("script");
// script.src = "https://gitcdn.link/repo/freeCodeCamp/testable-projects-fcc/master/build/bundle.js";
// script.async = true;
// le.appendChild(script);

// postscribe('#my-fcc-test-suite', '<script src="https://gitcdn.link/repo/freeCodeCamp/testable-projects-fcc/master/build/bundle.js"></script>',  {
//     done: () => {
//         // ReactDOM.render(<App />, document.getElementById('root'));
//         // registerServiceWorker();
        
//     }
// });
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
