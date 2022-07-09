import React from 'react';
import './App.css';
import { useAppSelector } from './hooks/useAppSelector';
import { Views } from './features/viewSlice';
import EnterView from './views/EnterView';
import ListenerView from './views/ListenerView';
import PublisherView from './views/PublisherView';

function App() {
    const view: Views = useAppSelector(state => state.view);

    function getView() {
        switch (view) {
            case Views.Enter:
                return <EnterView />;

            case Views.Listener:
                return <ListenerView />;

            case Views.Publisher:
                return <PublisherView />;
        }
    }

    return (
        <div className='App'>
            <div id='logo-block'>
                <img src='limq-logo.svg' alt='' />
            </div>

            {getView()}
        </div>
    );
}

export default App;
