const config = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_DATABASE_URL,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor(app: any) {
    app.initializeApp(config);

    /* Helper */

    (this as any).serverValue = app.database.ServerValue;
    (this as any).emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    (this as any).auth = app.auth();
    (this as any).db = app.database();

    /* Social Sign In Method Provider */

    (this as any).facebookProvider = new app.auth.FacebookAuthProvider();
  }

  // *** Auth API ***

  doSignInWithFacebook = () =>
    (this as any).auth.signInWithPopup((this as any).facebookProvider);

  doSignOut = () => (this as any).auth.signOut();

  doPasswordReset = (email: any) => (this as any).auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    (this as any).auth.currentUser.sendEmailVerification({
      url: process.env.GATSBY_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = (password: any) =>
    (this as any).auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next: any, fallback: any) =>
    (this as any).auth.onAuthStateChanged((authUser: any) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot: any) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = (uid: any) => (this as any).db.ref(`users/${uid}`);

  users = () => (this as any).db.ref('users');

  // *** Message API ***

  message = (uid: any) => (this as any).db.ref(`messages/${uid}`);

  messages = () => (this as any).db.ref('messages');
}

let firebase: any;

function getFirebase(app: any) {
  console.log("GETTTT FIREBASE!!!!!!");
  if (!firebase) {
    firebase = new Firebase(app);
  }

  return firebase;
}

export default getFirebase;
