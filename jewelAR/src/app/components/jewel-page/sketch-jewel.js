

let ears1img, ears2img, eye1img, neck1img, neckimg, nose1img, ForeHeadimg;
let isear = false;
let isEye = false;
let isNeck = false;
let ishead = false;
let isNose = false;
let eyeDistance;
let count;
let eyetemp, eartemp, nosetemp, necktemp, headtemp;


//Facial parts points on mediapipe face mesh
cont = [127, 234, 132, 58, 172, 150, 149, 148, 152, 377, 378, 379, 397, 288, 361, 454,
    356];
lips = [57, 40, 37, 0, 267, 270, 287, 321, 314, 17, 84, 91];
brows = [70, 63, 105, 66, 107, 336, 296, 334, 293, 300];
nose = [168, 6, 195, 4, 98, 97, 2, 326, 327];
noseleft = [126];
noseright = [281];
eyes = [275];
mouth = [78, 81, 13, 311, 308, 402, 14, 178];
ear1 = [234];
ears2 = [454];
head = [10];
dist = [52, 282];
neck = [200];

//p5.js used to load images
let sketch = function (p) {
    let canvas;
    //Images are stored in variable
    p.preload = function () {
        img = p.loadImage('data:image/png;base64' + this.jewel.image);
    };

    //Canvas Created infront of webcam video output and PNG images placed on the canvas
    p.setup = function () {
        canvas = p.createCanvas(880, 680);
        canvas.id("video1");
    };

    p.draw = function () {
        p.clear();

        if (detections == undefined) {
            alert("please wait");
        }

        if (detections != undefined) {
            if (
                detections.multiFaceLandmarks != undefined &&
                detections.multiFaceLandmarks.length >= 1
            ) {
               
            p.detectears1();

        }

    }

    if (detections != undefined && isear1) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectears1();

        }
    }
    if (detections != undefined && isear2) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectears1();

        }
    }
    if (detections != undefined && isear3) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectears1();

        }
    }
    if (detections != undefined && isear4) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectears1();

        }
    }
    if (detections != undefined && isear5) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectears1();

        }
    }



    if (detections != undefined && isEye1) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectEyes2();

        }
    } if (detections != undefined && isEye2) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectEyes2();

        }
    } if (detections != undefined && isEye3) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectEyes2();

        }
    } if (detections != undefined && isEye4) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectEyes2();

        }
    } if (detections != undefined && isEye5) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectEyes2();

        }
    }


    if (detections != undefined && isNeck) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }
    }
    if (detections != undefined && isNeck1) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }
    }
    if (detections != undefined && isNeck2) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }
    }
    if (detections != undefined && isNeck3)
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }
    if (detections != undefined && isNeck4)
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }
    if (detections != undefined && isNeck5)
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNeck();
        }

    if (detections != undefined && ishead) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectHead();
        }
    }
    if (detections != undefined && ishead1) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectHead();
        }
    }

    if (detections != undefined && isNose1) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNose1();
        }
    }
    if (detections != undefined && isNose2) {
        if (
            detections.multiFaceLandmarks != undefined &&
            detections.multiFaceLandmarks.length >= 1
        ) {
            p.detectNose2();
        }
    }


};
//Calculating the distance between the eyes to get the distance between the user and camera,Then it is used to resize the image according to that distance
function distance() {
    x1 = detections.multiFaceLandmarks[0][282].x * p.width;
    y1 = detections.multiFaceLandmarks[0][282].y * p.height;
    x2 = detections.multiFaceLandmarks[0][52].x * p.width;
    y2 = detections.multiFaceLandmarks[0][52].y * p.height;
    eyeDistance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

//Functions that dectects points and place PNG images
p.detectears1 = function () {
    let x, y;

    for (let i = 0; i < ear1.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][ear1[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][ear1[i]].y * p.height;

        }

    }

    if (eartemp == 1) {
        p.image(ears1img, x - 50, y + 20);
        ears1img.resize(80, 80);
    }
    if (eartemp == 2) {
        p.image(ears2img, x - 50, y + 20);
        ears2img.resize(80, 80);
    }
    if (eartemp == 3) {
        p.image(ears3img, x - 50, y + 20);
        ears3img.resize(80, 80);
    }
    if (eartemp == 4) {
        p.image(ears4img, x - 30, y + 30);
        ears4img.resize(30, 40);
    }
    if (eartemp == 5) {
        p.image(ears5img, x - 30, y + 30);
        ears5img.resize(40, 60);
    }
    if (eartemp == 6) {
        p.image(ears6img, x - 10, y + 20);
        ears6img.resize(20, 20);
    }


    let d, e;

    for (let i = 0; i < ears2.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            d = detections.multiFaceLandmarks[0][ears2[i]].x * p.width;
            e = detections.multiFaceLandmarks[0][ears2[i]].y * p.height;

        }

    }

    if (eartemp == 1) {
        p.image(ears1img, d - 50, e + 20);
        ears1img.resize(80, 80);
    }
    if (eartemp == 2) {
        p.image(ears2img, d - 50, e + 20);
        ears2img.resize(80, 80);
    }
    if (eartemp == 3) {
        p.image(ears3img, d - 50, e + 20);
        ears3img.resize(80, 80);
    }
    if (eartemp == 4) {
        p.image(ears4img, d - 10, e + 30);
        ears4img.resize(30, 40);
    }
    if (eartemp == 5) {
        p.image(ears5img, d - 10, e + 30);
        ears5img.resize(40, 60);
    }
    if (eartemp == 6) {
        p.image(ears6img, d - 10, e + 20);
        ears6img.resize(20, 20);
    }
};


p.detectEyes2 = function () {
    let x, y;

    for (let i = 0; i < eyes.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][eyes[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][eyes[i]].y * p.height;

        }
        if (eyetemp == 1) {
            distance();
            eye1img.width = eyeDistance * 1.8;
            eye1img.height = eyeDistance * 1.8;
            p.image(eye1img, x - eyeDistance, y - eyeDistance);
        }
        if (eyetemp == 2) {
            distance();
            eye2img.width = eyeDistance * 1.8;
            eye2img.height = eyeDistance * 1.8;
            p.image(eye2img, x - eyeDistance / 1.03, y - eyeDistance / 1.15);
        } if (eyetemp == 3) {
            distance();
            eye3img.width = eyeDistance * 1.8;
            eye3img.height = eyeDistance * 1.8;
            p.image(eye3img, x - eyeDistance, y - eyeDistance);
        } if (eyetemp == 4) {
            distance();
            eye4img.width = eyeDistance * 1.8;
            eye4img.height = eyeDistance * 1.8;
            p.image(eye4img, x - eyeDistance, y - eyeDistance);
        } if (eyetemp == 5) {
            distance();
            eye5img.width = eyeDistance * 1.8;
            eye5img.height = eyeDistance * 1.8;
            p.image(eye5img, x - eyeDistance / 1.05, y - eyeDistance / 0.75);
        }
    }




};


p.detectNeck = function () {

    let x, y;


    for (let i = 0; i < cont.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][cont[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][cont[i]].y * p.height;



        }
        if (necktemp == 1) {
            distance();
            neckimg.width = eyeDistance * 3.5;
            neckimg.height = eyeDistance * 3.5;
        }
        if (necktemp == 2) {
            distance();
            neck1img.width = eyeDistance * 2.5;
            neck1img.height = eyeDistance * 2.5;
        }
        if (necktemp == 3) {
            distance();
            neck2img.width = eyeDistance * 2.5;
            neck2img.height = eyeDistance * 2.5;
        }
        if (necktemp == 4) {
            distance();
            neck3img.width = eyeDistance * 2.5;
            neck3img.height = eyeDistance * 2.5;
        }
        if (necktemp == 5) {
            distance();
            neck4img.width = eyeDistance * 3.2;
            neck4img.height = eyeDistance * 2.5;
        }
        if (necktemp == 6) {
            distance();
            neck5img.width = eyeDistance * 2;
            neck5img.height = eyeDistance * 2;
        }

    }
    if (necktemp == 1) {
        p.image(neckimg, x - eyeDistance * 2.5, y + eyeDistance * 1.2);
    }
    if (necktemp == 2) {
        p.image(neck1img, x - eyeDistance * 2, y + eyeDistance * 1.2);
    }
    if (necktemp == 3) {
        p.image(neck2img, x - eyeDistance * 2, y + eyeDistance * 1.2);
    }
    if (necktemp == 4) {
        p.image(neck3img, x - eyeDistance * 2, y + eyeDistance * 1.2);
    }
    if (necktemp == 5) {
        p.image(neck4img, x - eyeDistance * 2.5, y + eyeDistance * 1.2);
    }
    if (necktemp == 6) {
        p.image(neck5img, x - eyeDistance * 1.85, y + eyeDistance * 1.2);
    }
};



p.detectHead = function () {
    let x, y;

    for (let i = 0; i < head.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][head[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][head[i]].y * p.height;

        }
    }
    if (headtemp == 1) {
        p.image(ForeHeadimg, x - 150, y - 100);
        ForeHeadimg.resize(300, 150);
    }
    if (headtemp == 2) {
        p.image(ForeHead1img, x - 40, y - 150);
        ForeHead1img.resize(80, 150);
    }
};




p.detectNose1 = function () {
    let x, y;

    for (let i = 0; i < noseleft.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][noseleft[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][noseleft[i]].y * p.height;

        }
    }

    p.image(nose1img, x - 5, y - 10);
    distance();
    nose1img.width = eyeDistance / 5;
    nose1img.height = eyeDistance / 5;
};
p.detectNose2 = function () {
    let x, y;

    for (let i = 0; i < noseright.length; i++) {
        for (let j = 0; j < detections.multiFaceLandmarks[0].length; j++) {
            x = detections.multiFaceLandmarks[0][noseright[i]].x * p.width;
            y = detections.multiFaceLandmarks[0][noseright[i]].y * p.height;

        }
    }

    p.image(nose2img, x - 5, y - 10);
    distance();
    nose2img.width = eyeDistance / 5;
    nose2img.height = eyeDistance / 5;
};





};

let myp5 = new p5(sketch);
