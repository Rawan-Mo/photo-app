import React from 'react';

class Suggestions extends React.Component {
  
    constructor(props) {
        super(props);
        // initialization code here
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen
        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                <div>
                    Suggestions
                    {/* Suggestions */}
                </div>
            </div>
        );
     }
}

export default Suggestions;