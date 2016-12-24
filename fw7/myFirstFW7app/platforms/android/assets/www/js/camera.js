//Camera Stuff

  // body
  var camBtn = document.getElementById('cameraBtn');
  camBtn.addEventListener('click', function () {
    console.log('vaginas')

    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI
    });
  
    function onSuccess(imageURI) {
      var image = document.getElementById('myImage');
      image.src = imageURI;
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }
  });
