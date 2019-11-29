const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

/**
 * This scope tells google what information we want to request.
 */
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const config = {
  client_id:
    "109725632893-1tr93d7c201ja9q61fhfp5cc9ct8uvtr.apps.googleusercontent.com",
  client_secret: "Afas-NmRRo7ew--jl-OlV6XI",
  redirect: "http://localhost:3000/login",
};

const createConnection = () => {
  return new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect
  );
};

const getConnectionUrl = auth => {
  return auth.generateAuthUrl({
    access_type: "offline", // access type and approval prompt will force a new refresh token to be made each time signs in
    prompt: "consent",
    scope: scopes,
  });
};

/**
 * Create the google url to be sent to the client.
 */
const getUrlGoogle = () => {
  const url = getConnectionUrl(createConnection());
  return url;
};

const setGooglePeopleClient = auth => {
  return google.people({
    version: "v1",
    auth,
  });
};

module.exports = {
  signJWT: (payload, secret, expiresIn) => {
    console.log("expiresIn", expiresIn);
    return jwt.sign(payload, secret, {
      expiresIn: Number(expiresIn),
    });
  },
  getUrlGoogle,
  getGoogleAccountByCode: async code => {
    // get the auth "tokens" from the request
    const auth = createConnection();
    try {
      console.log("CODE", JSON.stringify(code));
      const { tokens } = await auth.getToken({ code });
      auth.setCredentials(tokens);
      const people = setGooglePeopleClient(auth);
      const { data } = await people.people.get({
        resourceName: "people/me",
        personFields: "emailAddresses,nicknames,names",
      });

      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  generateNickname: fullName => {
    console.log("fullName", fullName);
    return fullName.replace(" ", "_").toLowerCase();
  },
  objectEmpty: object => Object.keys(object).length,
};
