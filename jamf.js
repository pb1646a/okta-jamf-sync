const axios = require("axios");
const jsonxml = require('jsontoxml');

class Jamf {
  constructor(obj) {
    (this.jamfUser = obj.user),
      (this.jamfPass = obj.pass),
      (this.jamfUri = obj.uri);
  }
  instance() {
    return axios.create({
      baseURL: this.jamfUri,
      auth: {
        username: this.jamfUser,
        password: this.jamfPass
      }
    });
  }
  get(url) {
    return this.instance().get(url);
  }
  post(url, data){
    let config = {
      headers:{
        "Content-type": "application/xml",
            "Accept": "application/xml"
      },
      transformRequest: [function (data, headers) {
        let d = jsonxml(data)
      
        return d;
      }]
    
    }
  return this.instance().post(url, data, config)
  }
}

module.exports = Jamf;