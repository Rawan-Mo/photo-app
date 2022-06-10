import React from 'react';

class Profile extends React.Component {
  
    constructor(props) {
        super(props);
        // initialization code here
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen
        return (
            <header className='profile'>
                 {/* <h1>{this.props.title}</h1> */}
                 <img className='pic' src={this.props.pic} alt="profile pic" />
                <h2> {this.props.username} </h2>
            </header>
        );
     }
}

export default Profile;
