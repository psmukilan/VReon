let detections = {};

//webcam Output
var video = document.getElementById('video1');
video.setAttribute('playsinline', '');
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.style.width = '880px';
video.style.height = '680px';

//Front camera access
var facingMode = "user";
var constraints = {
    audio: false,
    video: {
        facingMode: facingMode
    }
};

navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.srcObject = stream;
});

function gotFaces(results) {
    detections = results;
}

//mediapipe facemesh cdn Integration(Face Tracking API)
const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
faceMesh.onResults(gotFaces);

//User Image and Video uploading Button
let photobtn = document.getElementById("photo-btn");
let btn = document.getElementById("btn");
let img = document.getElementById("img");
let video2 = document.getElementById("video2");
video2.setAttribute('playsinline', '');
video2.setAttribute('autoplay', '');
video2.setAttribute('muted', '');
video2.setAttribute('loop','')
video2.style.width = '880px';
video2.style.height = '680px';
btn.style.display = "none";
photobtn.addEventListener('click', photo);
function photo() {
    if (video.style.display == "block") {
        video.style.display = "none";
        btn.style.display = "block";
    }
    
    else {
        video.style.display = "block";
        btn.style.display = "none";
    }


}
let picture;

function loadMedia(event) {
    const file = event.target.files[0];
    const mediaType = file.type.split('/')[0];

    if (mediaType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgPreview = document.getElementById('media-preview');
            imgPreview.src = e.target.result;
            picture = e.target.result;
            video2.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else if (mediaType === 'video') {
        const URL = window.URL || window.webkitURL;
        const videoURL = URL.createObjectURL(file);
        
        video2.src = videoURL;
        video2.style.display = 'block';
        video.style.display = 'none';
        picture = null;
    }
    video.srcObject = video2;
    const camera = new Camera(video, {
        onFrame: async () => {
            await faceMesh.send({ image: video });
        },
        width: 880,
        height: 680,
    });
    
}
const camera = new Camera(video, {
    onFrame: async () => {
        await faceMesh.send({ image: video });
    },
    width: 880,
    height: 680,
});
camera.start();
function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 5000);

    function checkReady() {
        if (document.getElementsByTagName("body")[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? "block" : "none";
}

onReady(function () {
    show("page", true);
    show("loading", false);
});
