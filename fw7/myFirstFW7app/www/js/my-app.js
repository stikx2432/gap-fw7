// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

// Init couchDB and do magic
var db = new PouchDB('test_remote');

var localData = [];
getData()
db.info().then(function (info) {
  holderObj = info;
  console.log(holderObj);
})






// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    template7Data: {
        // Will be applied for page with "projects.html" url
        'url:projects.html': {
            firstname: "John",
            lastname: "Doe",
            age: 32,
            position: "CEO",
            company: "Google",
            interests: ["swimming", "music", "JavaScript", "iMac", "iOS apps", "sport"],
            projects: [
                {
                    title: "Google",
                    description: "Nice search engine"
                },
                {
                    title: "YouTube",
                    description: "Online video service"
                },
                {
                    title: "Android",
                    description: "Mobile operating system"
                }
            ]
        },

        // Will be applied for page with data-page="contacts"
        'page:contacts': {
            tel: '+1 (222) 333-44-55',
            email: 'john@doe.com',
            country: 'USA',
            city: 'San Francisco',
            zip: '12345',
            street: 'Awesome st'
        },

        // Just plain data object that we can pass for other pages using data-contextName attribute
        cars: [
            {
                vendor: 'Volkswagen',
                model: 'Passat',
                power: 152,
                speed: 280,
                weight: 1400,
                color: 'black',
                year: 2012,
                description: ''
            },
            {
                vendor: 'Skoda',
                model: 'Superb',
                power: 152,
                speed: 260,
                weight: 1600,
                color: 'white',
                year: 2013,
                description: ''
            },
            {
                vendor: 'Ford',
                model: 'Mustang',
                power: 480,
                speed: 320,
                weight: 1200,
                color: 'red',
                year: 2014,
                description: ''
            },
        ],

        // Another plain data object, used in "tasks" link in data-contextName object
        tasks: localData
    },
    taskPanel: people = [
      {
        firstName: 'John', lastName: 'Doe'
      }
    ]
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
});

var sideView = myApp.addView('.view-panel', {

});

// After Load Views

$$('#taskButton').on('click', function () {
  var inputText = $$('#task').val();
  var randId = randomString(6);
  console.log(randId);
  if (inputText !== '') {
      db.get(randId).catch(function(err) {
          if (err.name === 'not_found') {
              return {
                  '_id': randId,
                  'task': inputText
              }
          } else {
              throw err;
          }
      }).then(function (doc) {

          doc._id = randId;
          doc.task = inputText;
          // global object to hold tasks for template7Data

          console.log(doc);

          return db.put(doc);
        }).then(function() {
            return db.get(randId).then(function(doc) {
              myApp.alert('Task: ' + doc.task + 'Task _id:' + doc._id + ' inputed to DB.', 'Success!')
            })
          })
    } else {
      myApp.alert('You didn\'t input anything', 'Hey!', function () {

      })
    }


  });



function getData () {
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {

    for (var i = 0; i < result.rows.length; i++) {
      if (result.rows[i].doc.task !== undefined) {
        localData.push( { task: result.rows[i].doc.task } );
      }

    }

  }).catch(function (err) {
    console.log(err);
  });
}

var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
