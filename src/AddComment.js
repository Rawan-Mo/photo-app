import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {  

    constructor(props) {
        super(props);

        // this.state = {
        //     value: '',
        // }
        
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    // handleChange(ev) {
    //     this.setState({
    //         value: ev.target.value
    //     });
    // }




render () {

        return (
                <form data-id={this.props.postId} className='add-comment'>
                    <div className='input-holder'>
                        <input 
                            className='comment-textbox' 
                            aria-label="Add a comment" 
                            type='text' 
                            placeholder="Add a comment..." 
                            //onChange={this.handleChange}

                            // ref={(input) => this.comment = input} 
                            //value={this.state.value}
                            
                        />
                    </div>
                        <button className='link' type='submit' >Post</button>
                    
                </form>
                
        )
        
    }
}

export default AddComment;