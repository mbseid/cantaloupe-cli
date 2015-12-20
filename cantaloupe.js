#!/usr/bin/env node

var prompt = require('prompt');
var request = require('superagent');
var savedSettingsFileName = ".cantaloupe";
var fs = require('fs');
var process = require('process');
var lodash = require('lodash');
var Regex = require("regex");
var glob = require("glob");

//Remove this once cantaloupe.io fixes their HTTPS cert
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function writeCredentials(creds){
  fs.writeFileSync(savedSettingsFileName, JSON.stringify(creds))
}

function readCredentials(){
  var json = fs.readFileSync(savedSettingsFileName)
  return JSON.parse(json);
}
function login(){
  console.log("Please Login:")
  prompt.get([{
      name: 'username',
      required: true
    }, {
      name: 'password',
      hidden: true,
      conform: function (value) {
        return true;
      }
    }], function (err, result) {
      var loginUrl = "https://cantaloupe.io/v1/auth/login"
      request
        .post(loginUrl)
        .send({
            email: result.username,
            password: result.password,
            username: result.username
          })
        .set('Accept', 'application/json')
        .end(function(err, res){
          if(res.statusCode == 403){
            console.error("Wasn't able to log in, please enter the correct username and password")
          }else if(res.statusCode == 200){
            var cookieSet = res.headers['set-cookie'][0];
            var startIndex = cookieSet.indexOf("=")
            var endIndex = cookieSet.indexOf(";")
            var found = cookieSet.substring((startIndex+1), endIndex);
            writeCredentials({
              cookie: found
            })
            console.log("Logged In, Feel Free To Deploy");

          }
          });
        });
}

function deploy(location, url){
  var creds = readCredentials();
  if(lodash.isUndefined(creds)){
    console.log("You need to login first");
    login();
    return;
  }
  var deployRequest = request
    .post("https://cantaloupe.io/v1/site/deploy")
    .set( 'Cookie', "session="+creds.cookie)
    .type('form')
    .set('Accept', 'application/json')
    .field('site', JSON.stringify({
      url: url
    }))

  glob(location+"/**", {
    nodir: true
  }, function (er, files) {
    console.log("Deploying all the files found in the location"+location, files);
    for(var i = 0; i < files.length; files++){
      deployRequest = deployRequest.attach("file["+i+"]", files[i]) 
    }
    deployRequest.end(function(err, res){
      if(res.statusCode == 200){
        console.log("Deploy was successful!")
      }else{
        if(err){
          console.error("There was an error deploying", err)
        }else{
          console.error("There was an unknown error deploying")
        }
      }
    });
  })
  
}

var argv = require('yargs').argv;
var command = argv._[0]
switch(command){
  case 'login':
    login();
    break;
  case 'deploy':
    if(lodash.isUndefined(argv.site)){
      console.error("To deploy you need to specify a site: cantaloupe deploy --site site-name")
      return;
    }
    deploy("build", argv.site+".cantaloupe.io");
    break;
}
