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


// {this.state.stories.map(
//     story => <div className='story'> 
//                 <img className='pic' src={story.user.thumb_url}/>
//                 <p>{story.user.username}</p>
//             </div>

{/* <p className="suggestion-text">Suggestions for you</p>
                <div>
                    Suggestions
                    {/* Suggestions */}
                // </div> */}



{/* <div className="suggestions">



{this.state.users.map(
    user => 
        <div className='suggestion'>
            <img className='pic' src={user.thumb_url}/>
            <p className='suggestion-text'>{user.username}</p>

        </div>                        
        )}
</div>                */}