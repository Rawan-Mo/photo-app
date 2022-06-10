import React from 'react';
import {getHeaders} from './utils';

class Stories extends React.Component {
  

    
    constructor(props) {
        super(props);
        this.state = {
            stories: [],
        }
        // initialization code here
        this.getStoriesFromServer();
    }

    getStoriesFromServer() {
        fetch('/api/stories', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => this.setState({
                stories: data
            }));
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen
        return (
            <header className="stories">
            
            {this.state.stories.map(
                story => <div className='story'> 
                            <img className='pic' src={story.user.thumb_url}/>
                            <p>{story.user.username}</p>
                        </div>

                
               

            )}
        </header>
        );
     }
}

export default Stories;