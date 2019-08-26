const Okta = require("@okta/okta-sdk-nodejs");
const orgUrl=process.env.OKTA_ORG_URL;
const token=process.env.OKTA_TOKEN;

const oktaClient = new Okta.Client({
  orgUrl: orgUrl,
  token: token
});

async function getUsers() {
  let users = [];
  const id = process.env.USER_GROUP;
  try {
    let userList = await oktaClient
      .listGroupUsers(id)
      .each(el => {
        users.push(el);
      });
      
    return users;
  } catch (e) {
    console.log(e)
  }
};



module.exports = getUsers;