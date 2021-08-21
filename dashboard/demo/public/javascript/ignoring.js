const $ = document.querySelector.bind(document);
const rectangles = [];

// DOM elements
const $screenshot = $('#screenshot');
const $draw = $('#draw');
const $marquee = $('#marquee');
const $boxes = $('#boxes');

// Temp variables
let startX = 0;
let startY = 0;
const marqueeRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

function startDrag(ev) {
    // middle button delete rect
    if (ev.button === 1) {
        const rect = hitTest(ev.layerX, ev.layerY);
        if (rect) {
            rectangles.splice(rectangles.indexOf(rect), 1);
            redraw();
        }
        return;
    }
    window.addEventListener('pointerup', stopDrag);
    $screenshot.addEventListener('pointermove', moveDrag);
    $marquee.classList.remove('hide');
    startX = ev.layerX;
    startY = ev.layerY;
    drawRect($marquee, startX, startY, 0, 0);
}

function revertMarqueeRect() {
    marqueeRect.x = 0;
    marqueeRect.y = 0;
    marqueeRect.width = 0;
    marqueeRect.height = 0;
}

function stopDrag(ev) {
    $marquee.classList.add('hide');
    window.removeEventListener('pointerup', stopDrag);
    $screenshot.removeEventListener('pointermove', moveDrag);
    if (
        ev.target === $screenshot
        && marqueeRect.width
        && marqueeRect.height) {
        rectangles.push(Object.assign({}, marqueeRect));
        redraw();
    }
    revertMarqueeRect();
}

function moveDrag(ev) {
    let x = ev.layerX;
    let y = ev.layerY;
    let width = startX - x;
    let height = startY - y;
    if (width < 0) {
        width *= -1;
        x -= width;
    }
    if (height < 0) {
        height *= -1;
        y -= height;
    }
    Object.assign(marqueeRect, { x, y, width, height });
    drawRect($marquee, marqueeRect);
}

function hitTest(x, y) {
    return rectangles.find(rect => (
        x >= rect.x &&
        y >= rect.y &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
    ));
}

function redraw() {
    boxes.innerHTML = '';
    rectangles.forEach((data) => {
        boxes.appendChild(drawRect(
            document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
        ));
    });
}

function drawRect(rect, data) {
    const { x, y, width, height } = data;
    rect.setAttributeNS(null, 'width', width ? width : 0);
    rect.setAttributeNS(null, 'height', height ? height : 0);
    rect.setAttributeNS(null, 'x', x ? x : 0);
    rect.setAttributeNS(null, 'y', y ? y : 0);
    return rect;
}

const onClickRectangle = () => {
    console.log(`rectangle clicking`);
};

const enableIgnore = () => {
    $marquee.classList.add('hide');
    $screenshot.addEventListener('pointerdown', startDrag);
};

const onClickInfo = () => {
    console.log(rectangles);
};

const onClickRemove = () => {
    console.log(`clicking remove`);
};