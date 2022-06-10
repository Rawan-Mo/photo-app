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
            <header>
                Profile
                {/* Navigation Links */}
            </header>
        );
     }
}

export default Profile;
