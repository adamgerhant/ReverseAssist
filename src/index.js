import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import About from './about';
import "./index.css"
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" exact element={<App/>} />
            <Route path="/about" element={<About/>} />
        </Routes>
    
    </Router>
    
);


