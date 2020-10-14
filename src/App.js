import React from "react";

function App(props) {
    return (
        <div className="App">
            {props.children}
            {/* <IndexComp {...props} /> */}
        </div>
    );
}

export default App;
