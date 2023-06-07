import { JewelInfo } from './jewel-info';
import * as facemesh from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

export class DetectJewel {
    public selectedJewels: JewelInfo[] = [];
    public enableJewelDetection: Boolean = true;
    public intervalId!: NodeJS.Timer;

    constructor() { }

    public async detectLandmarks(inputVideo: HTMLVideoElement, inputCanvasContext: CanvasRenderingContext2D, jewelArray: JewelInfo[] = this.selectedJewels) {
        // Load the Facemesh model
        const model = await facemesh.load();

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                inputVideo.srcObject = stream;
                inputVideo.play();
                //Start the webcam stream
                inputVideo.onloadeddata = (e) => {
                    // Detect facial landmarks in real-time
                    this.intervalId = setInterval(async () => {
                        if (this.enableJewelDetection) {
                            const predictions = await model.estimateFaces(inputVideo);
                            if (predictions && predictions.length) {
                                // Draw the facial landmarks on the canvas
                                inputCanvasContext.clearRect(0, 0, inputVideo.width, inputVideo.height);
                                for (let i = 0; i < predictions.length; i++) {
                                    const keypoints = predictions[i].scaledMesh as any[];
                                    let width = inputVideo.width;
                                    let height = inputVideo.height;

                                    inputCanvasContext.drawImage(inputVideo, 0, 0, width, height);

                                    jewelArray.forEach((jewel) => {
                                        this.drawJewelOnCanvas(jewel, inputCanvasContext, keypoints, width, height);
                                    })
                                }
                            }
                            else {
                                inputCanvasContext.clearRect(0, 0, inputVideo.width, inputVideo.height);
                                const noFaceImage = new Image();
                                noFaceImage.src = "../../../../assets/no-face.png";
                                inputCanvasContext.drawImage(noFaceImage, 0, 0, noFaceImage.width, noFaceImage.height);
                            }
                        }
                    }, 200);
                }
            });
    }

    cancelTimer() {
        clearInterval(this.intervalId);
    }

    drawJewelOnCanvas(jewel: JewelInfo, ctx: CanvasRenderingContext2D, keypoints: any[], width: number, height: number) {
        switch (jewel.category) {
            case "Earring":
                const [earring_x1, earring_y1, earring_z1] = keypoints[93];
                const [earring_x2, earring_y2, earring_z2] = keypoints[323];
                const eyeDistanceForEarring = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                const earringImage = new Image();
                const currentEarringImage = jewel.image;
                earringImage.src = "data:image/png;base64," + currentEarringImage;
                earringImage.onload = (e) => {
                    let eardepth1 = Math.abs(earring_z1);
                    let eardepth2 = Math.abs(earring_z2);
                    if ((Math.abs(eardepth1 - eardepth2) > 40)) {
                        if (eardepth1 < eardepth2) {
                            ctx.drawImage(earringImage, Math.abs(earring_x1 - eyeDistanceForEarring / 2 - 10), earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
                        }
                        if (eardepth2 < eardepth1) {
                            ctx.drawImage(earringImage, Math.abs(earring_x2 - eyeDistanceForEarring / 2 + 10), earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
                        }
                    } else {
                        ctx.drawImage(earringImage, Math.abs(earring_x1 - eyeDistanceForEarring / 2 - 10), earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
                        ctx.drawImage(earringImage, Math.abs(earring_x2 - eyeDistanceForEarring / 2 + 10), earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
                    }
                }
                break;

            case "Necklace":
                const [necklace_x, necklace_y, necklace_z] = keypoints[136];
                const eyeDistanceForNecklace = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                const necklaceImage = new Image();
                const currentNecklaceImage = jewel.image;
                necklaceImage.src = "data:image/png;base64," + currentNecklaceImage;
                necklaceImage.onload = (e) => {
                    ctx.drawImage(necklaceImage, necklace_x - (eyeDistanceForNecklace * 1.8), necklace_y, eyeDistanceForNecklace * 5, eyeDistanceForNecklace * 5);
                }
                break;

            case "Nosepin":
                const [nosePin_x, nosePin_y, nosePin_z] = keypoints[457];
                const eyeDistanceForNosePin = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                const nosePinImage = new Image();
                const currentNosePinImage = jewel.image;
                nosePinImage.src = "data:image/png;base64," + currentNosePinImage;
                nosePinImage.onload = (e) => {
                    ctx.drawImage(nosePinImage, Math.abs(nosePin_x - eyeDistanceForNosePin), Math.abs(nosePin_y - (eyeDistanceForNosePin * 0.9)), eyeDistanceForNosePin * 1.8, eyeDistanceForNosePin * 1.8);
                }
                break;

            case "Nethichutti":
                const [nethichutti_x, nethichutti_y, nethichutti_z] = keypoints[10];
                const eyeDistanceForNethichutti = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                const nethichuttiImage = new Image();
                const currentNethichuttiImage = jewel.image;
                nethichuttiImage.src = "data:image/png;base64," + currentNethichuttiImage;
                nethichuttiImage.onload = (e) => {
                    ctx.drawImage(nethichuttiImage, Math.abs(nethichutti_x - (eyeDistanceForNethichutti)), Math.abs(nethichutti_y - (eyeDistanceForNethichutti)), eyeDistanceForNethichutti * 2, eyeDistanceForNethichutti * 2);
                }
                break;
        }
    }

    CalculateEyeDistance(rightEye: any[], leftEye: any[], width: number, height: number): number {
        const x1 = rightEye[0];
        const y1 = rightEye[1];
        const x2 = leftEye[0];
        const y2 = leftEye[1];
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}