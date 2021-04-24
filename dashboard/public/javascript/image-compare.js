let compareImageBaselineWidth = 0;
let compareImageBaselineHeight = 0;

let compareImageLatestWidth = 0;
let compareImageLatestHeight = 0;

let compareImageMaxWidth = 0;
let compareImageMaxHeight = 0;

const applyImageCompare = () => {
  const ImageCompareOptions = {
    controlColor: "#FFFFFF",
    controlShadow: true,
    addCircle: false,
    addCircleBlur: true,
    showLabels: true,
    labelOptions: {
      before: 'baseline',
      after: 'latest',
      onHover: true
    },
    smoothing: false,
    smoothingAmount: 100,
    hoverStart: true,
    verticalMode: false,
    startingPoint: 50,
    fluidMode: false
  };

  const element = document.getElementById("image-compare");
  const viewer = new ImageCompare(element, ImageCompareOptions).mount();
};

const setMaxSize = (baselineImageElement, latestImageElement) => {
  const baselineImageRulerElement = new Image();
  baselineImageRulerElement.onload = () => {
    compareImageBaselineWidth = baselineImageRulerElement.width;
    compareImageBaselineHeight = baselineImageRulerElement.height;
  };

  const latestImageRulerElement = new Image();
  latestImageRulerElement.onload = () => {
    compareImageLatestWidth = latestImageRulerElement.width;
    compareImageLatestHeight = latestImageRulerElement.height;
  };

  baselineImageRulerElement.src = baselineImageElement.src;
  latestImageRulerElement.src = latestImageElement.src

  const checkExist = setInterval(function() {
    if (compareImageBaselineWidth * compareImageBaselineHeight * compareImageLatestWidth * compareImageLatestHeight) {
      compareImageMaxWidth = Math.max(compareImageBaselineWidth, compareImageLatestWidth);
      compareImageMaxHeight = Math.max(compareImageBaselineHeight, compareImageLatestHeight);
      
      console.log(`compareImageMaxWidth: ${compareImageMaxWidth}, compareImageMaxHeight: ${compareImageMaxHeight}`);

      clearInterval(checkExist);
    }
 }, 100);

}

const enableOpenImageCompareModalButton = () => {
  const openImageCompareModalButtonElement = document.getElementById("openImageCompareModalButton");
  if (openImageCompareModalButtonElement) {
    openImageCompareModalButtonElement.disabled = false;
  }
}

const createImageCompareModal = () => {
  applyImageCompare();

  const imageCompareBaselineElement = document.getElementById("image-compare-baseline");
  const imageCompareLatestElement = document.getElementById("image-compare-latest");

  setMaxSize(imageCompareBaselineElement, imageCompareLatestElement);

  const restyle = () => {
    const ratio = compareImageMaxWidth / window.innerWidth;

    const imageCompareElement = document.getElementById("image-compare");
    imageCompareElement.style.height = `${ratio >= 1 ? compareImageMaxHeight / ratio : compareImageMaxHeight}px`;

    imageCompareBaselineElement.style.width = `${compareImageMaxWidth >= window.innerWidth ? window.innerWidth : compareImageMaxWidth}px`;
    imageCompareBaselineElement.style.height = "100%";
    imageCompareBaselineElement.style.backgroundSize = 'contain';
    imageCompareBaselineElement.style.backgroundImage = `url('${imageCompareBaselineElement.src}')`;
    imageCompareBaselineElement.style.backgroundRepeat = 'no-repeat';
    imageCompareBaselineElement.src = "/public/image/transparent.webp";

    imageCompareLatestElement.style.width = `${compareImageMaxWidth >= window.innerWidth ? window.innerWidth : compareImageMaxWidth}px`;
    imageCompareLatestElement.style.height = "100%";
    imageCompareLatestElement.style.backgroundSize = 'contain';
    imageCompareLatestElement.style.backgroundImage = `url('${imageCompareLatestElement.src}')`;
    imageCompareLatestElement.style.backgroundRepeat = 'no-repeat';
    imageCompareLatestElement.src = "/public/image/transparent.webp";

    imageCompareLatestElement.parentElement.style.backgroundColor = "white";
  }

  const checkExist = setInterval(() => {
    if (compareImageMaxWidth * compareImageMaxHeight) {
      restyle();
      enableOpenImageCompareModalButton();
      clearInterval(checkExist);
    }
  }, 100);

}