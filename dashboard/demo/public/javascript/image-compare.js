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
  document.getElementById("openImageCompareModalButton").disabled = false;
}

const createImageCompareModal = () => {
  applyImageCompare();

  const imageCompareBaselineElement = document.getElementById("image-compare-baseline");
  const imageCompareLatestElement = document.getElementById("image-compare-latest");

  setMaxSize(imageCompareBaselineElement, imageCompareLatestElement);

  // imageCompareBaselineElement.onload = () => {
  //   console.log(`onloaded: ${imageCompareBaselineElement.width}, ${imageCompareBaselineElement.height}`);
  // }

  const restyle = () => {
    imageCompareBaselineElement.style.width = `${window.innerWidth}px`;
    imageCompareBaselineElement.style.height = `${compareImageMaxHeight >= window.innerHeight ? compareImageMaxHeight/2 : window.innerHeight}px`;
    imageCompareBaselineElement.style.backgroundSize = 'contain';
    imageCompareBaselineElement.style.backgroundImage = `url('${imageCompareBaselineElement.src}')`;
    imageCompareBaselineElement.style.backgroundRepeat = 'no-repeat';
    imageCompareBaselineElement.src = "public/image/transparent.png";

    imageCompareLatestElement.style.width = `${window.innerWidth}px`;
    imageCompareLatestElement.style.height = `${compareImageMaxHeight >= window.innerHeight ? compareImageMaxHeight/2 : window.innerHeight}px`;
    imageCompareLatestElement.style.backgroundSize = 'contain';
    imageCompareLatestElement.style.backgroundImage = `url('${imageCompareLatestElement.src}')`;
    imageCompareLatestElement.style.backgroundRepeat = 'no-repeat';
    imageCompareLatestElement.src = "public/image/transparent.png";

    imageCompareLatestElement.parentElement.style.backgroundColor = "white";
  }

  const checkExist = setInterval(() => {    
    if (compareImageMaxWidth * compareImageMaxHeight) {
      restyle();
      enableOpenImageCompareModalButton();
      clearInterval(checkExist);
    }
  }, 100);

  // console.log(imageCompareBaselineElement.naturalWidth, imageCompareBaselineElement.naturalHeight);
  // console.log(imageCompareLatestElement.naturalWidth, imageCompareLatestElement.naturalHeight);

  // const maxImageWidth = Math.max(imageCompareBaselineElement.width, imageCompareLatestElement.width);
  // const maxImageHeight = Math.max(imageCompareBaselineElement.height, imageCompareLatestElement.height);

  // console.log(maxImageWidth, window.innerWidth, maxImageHeight, window.innerHeight);

  // imageCompareBaselineElement.style.width = `${maxImageWidth >= window.innerWidth ? window.innerWidth : maxImageWidth}px`;
  // imageCompareBaselineElement.style.width = `${window.innerWidth}px`;
  // imageCompareBaselineElement.style.width = "100%";
  // imageCompareBaselineElement.style.height = `${maxImageHeight >= window.innerHeight ? maxImageHeight/2 : window.innerHeight}px`;
//  imageCompareBaselineElement.style.backgroundSize = maxImageWidth >= window.innerWidth ? 'contain' : 'initial';
  // imageCompareBaselineElement.style.backgroundSize = 'contain';
  // imageCompareBaselineElement.style.backgroundImage = `url('${imageCompareBaselineElement.src}')`;
  // imageCompareBaselineElement.style.backgroundRepeat = 'no-repeat';
  // imageCompareBaselineElement.src = "public/image/transparent.png";
  // imageCompareBaselineElement.removeAttribute("src");

  // imageCompareLatestElement.style.width = `${maxImageWidth >= window.innerWidth ? window.innerWidth : maxImageWidth}px`;
  // imageCompareLatestElement.style.width = `${window.innerWidth}px`;
  // imageCompareLatestElement.style.width = "100%";
  // imageCompareLatestElement.style.height = `${maxImageHeight >= window.innerHeight ? maxImageHeight/2 : window.innerHeight}px`;
//  imageCompareLatestElement.style.backgroundSize = maxImageWidth >= window.innerWidth ? 'contain' : 'initial';
  // imageCompareLatestElement.style.backgroundSize = 'contain';
  // imageCompareLatestElement.style.backgroundImage = `url('${imageCompareLatestElement.src}')`;
  // imageCompareLatestElement.style.backgroundRepeat = 'no-repeat';
  // imageCompareLatestElement.src = "public/image/transparent.png";
  // imageCompareLatestElement.removeAttribute("src");

  // imageCompareLatestElement.parentElement.style.backgroundColor = "white";
}