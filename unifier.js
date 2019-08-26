const Okta = require("./okta");
const Jamf = require("./jamf");

let j = new Jamf({
  uri: process.env.JAMF_URI,
  user: process.env.JAMF_USER,
  pass: process.env.JAMF_PASSWORD
});

async function formatForCasper() {
  try {
    let okta = await Okta();
    let users = okta.map(user => {
      return {
        user: {
          name: `${user.profile.login}`,
          full_name: `${user.profile.firstName} ${user.profile.lastName}`,
          username: `${user.profile.firstName.substring(0, 1)}${
            user.profile.lastName
          }`,
          email: `${user.profile.login}`,
          extension_attributes: [
            {
              extension_attribute: {
                id: 1,
                name: "OktaID",
                type: "String",
                value: user.id
              }
            }
          ]
        }
      };
    });
    return users;
  } catch (e) {
    console.log("error");
  }
}
function getUserListFromCasper() {
  let jUsers = j.get("/JSSResource/users");
  return jUsers;
}

async function uploadToCasper(users) {
  try {
    await users.forEach(user => {
      j.post("/JSSResource/users/id/0", user)
    });
  } catch (e) {
    console.log(e);
  }
}

Promise.all([getUserListFromCasper(), formatForCasper()])
  .then(data => {
    let jamfUsers = data[0].data.users;
    let oktaUsers = data[1];
    let newUsers = [];
    let count = 0;
    for (let i = 0; i < oktaUsers.length; i++) {
      for (let j = 0; j < jamfUsers.length; j++) {
        if (jamfUsers[j].name.includes(oktaUsers[i].user.name)) {
          count++;
        }
      }
      count < 1 ? newUsers.push(oktaUsers[i]) : null;
      count = 0;
    }
    uploadToCasper(newUsers)
      .then(x=>console.log('done'))
      .catch(console.log);
  })
  .catch(console.log);
