import React, { Component } from 'react';
const withFirebase = require('../firebase').withFirebase;



class SignInFacebookBase extends Component {
  constructor(props : any) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = (event: any) => {
    event.preventDefault();
    console.log((this.props as any).firebase);
    (this.props as any).firebase
      .doSignInWithFacebook()
      .then((socialAuthUser: any) => {
        // Create a user in your Firebase Realtime Database too
        return (this.props as any).firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: [],
        });
      })
      .then(() => {
        console.log('success!');
        this.setState({ error: null });
      })
      .catch((error: any) => {
        console.log(error);
        this.setState({ error });
      });


  };

  render() {
    const error = (this.state as any).error;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Facebook</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInFacebook = withFirebase(SignInFacebookBase);

export { SignInFacebook };
