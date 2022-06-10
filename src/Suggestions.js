import React from 'react';
import {getHeaders} from './utils';
import Suggestion from './Suggestion';

class Suggestions extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
        }
        // initialization code here
        this.getSuggestionsFromServer();
    }

    getSuggestionsFromServer() {
        fetch('/api/suggestions', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => this.setState({
                suggestions: data
            }));
    }


    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen

        return this.state.suggestions.length === 0 ? 

        (
            <div className="suggestions"> Loading Suggestions... </div>
        )
        :
        (
            <div className='suggestions'>
                <p className="suggestion-text">Suggestions for you</p>
            {this.state.suggestions.map(
                suggestion => 
                <Suggestion 
                    key={'suggestion-' + suggestion.id}
                    user={suggestion}
                />
            )}
            </div>
        );   
     }
}

export default Suggestions;