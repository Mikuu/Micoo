const enableIgnoring = () => {
    const DOR = document.querySelector.bind(document);
    let ignoringRatio = null;
    let rectangles = [];
    let blockIgnoringExistRectangles = [];

    const DORScreenshot = DOR('#screenshot');
    const DORDraw = DOR('#draw');
    const DORMarquee = DOR('#marquee');
    const DORBoxes = DOR('#boxes');

    const controlBaseElement = DORDraw; // it's DORScreenshot by default

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
        controlBaseElement.addEventListener('pointermove', moveDrag);
        DORMarquee.classList.remove('hide');
        startX = ev.layerX;
        startY = ev.layerY;
        drawRect(DORMarquee, startX, startY, 0, 0);
    }

    function revertMarqueeRect() {
        marqueeRect.x = 0;
        marqueeRect.y = 0;
        marqueeRect.width = 0;
        marqueeRect.height = 0;
    }

    function stopDrag(ev) {
        DORMarquee.classList.add('hide');
        window.removeEventListener('pointerup', stopDrag);
        controlBaseElement.removeEventListener('pointermove', moveDrag);
        if (marqueeRect.width && marqueeRect.height) {
            rectangles.push(Object.assign({}, marqueeRect));
            redraw();
        }
        revertMarqueeRect();
        enableOrDisableRemoveRectButton();
        enableOrDisablePersistRectanglesButton();
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
        drawRect(DORMarquee, marqueeRect);
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
            const rect = drawRect(
                document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
            );
            rect.addEventListener('pointerdown', onClickRectangle);
            boxes.appendChild(rect);
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

    const isSameRectangle = (rectangle1, rectangle2) => {
        return rectangle1.x == rectangle2.x
            && rectangle1.y == rectangle2.y
            && rectangle1.width == rectangle2.width
            && rectangle1.height == rectangle2.height
    }

    function resizeIgnoringAreaAndDrawExistRectangles() {
        const imageElement = document.getElementById("screenshot");
        const ignoringAreaElement = document.getElementById("ignoring-area");
        const drawElement = document.getElementById('draw');

        const drawExistsRectangles = () => {
            const rectanglesString = document.getElementById("boxes").getAttribute("data-rectangles");
            document.getElementById("boxes").removeAttribute("data-rectangles");

            const existRectangles = rectanglesString ? JSON.parse(rectanglesString) : [];
            rectangles = ignoringRatio <= 1 ? existRectangles : existRectangles.map(rectangle => {
                return {
                    x: rectangle.x / ignoringRatio,
                    y: rectangle.y / ignoringRatio,
                    width: rectangle.width / ignoringRatio,
                    height: rectangle.height / ignoringRatio
                }
            });

            blockIgnoringExistRectangles = [...rectangles]
            redraw();
        };

        const updateIgnoringAreaSize = (width, height) => {
            ignoringRatio = width / window.innerWidth;
            // console.log(`initialize ignoringRatio: ${ignoringRatio}`);

            const usingWidth = Math.min(width, window.innerWidth);
            const usingHeight = ignoringRatio >= 1 ? height / ignoringRatio : height;

            ignoringAreaElement.style.width = `${usingWidth}px`;
            ignoringAreaElement.style.height = `${usingHeight}px`;
            drawElement.setAttributeNS(null, 'viewBox', `0 0 ${usingWidth}, ${usingHeight}`);
        };

        const imageLoaderElement = new Image();
        imageLoaderElement.src = imageElement.src;

        const checkExist = setInterval(function() {
            if (imageLoaderElement.width * imageLoaderElement.height) {
                // console.log(`screenshotWidth: ${imageLoaderElement.width}, screenshotHeight: ${imageLoaderElement.height}`);
                updateIgnoringAreaSize(imageLoaderElement.width, imageLoaderElement.height);
                drawExistsRectangles();
                clearInterval(checkExist);
            }
        }, 100);
    }

    const onClickRectangle = (event) => {
        if (event.target.classList.contains("toRemove")) {
            event.target.classList.remove("toRemove");
        } else {
            event.target.classList.add("toRemove");
        }
        enableOrDisableRemoveRectButton();
    };

    const enableOrDisableRemoveRectButton = () => {
        const rectElements = document.querySelectorAll("#boxes rect");
        const removeRectangleButton = document.getElementById("removeRectangle");
        for (const rectElement of rectElements) {
            if (rectElement.classList.contains("toRemove")) {
                removeRectangleButton.classList.remove("disabled");
                return;
            }
        }
        removeRectangleButton.classList.add("disabled");
    };

    const isRectanglesChanged = () => {
        if (blockIgnoringExistRectangles.length !== rectangles.length) {
            return true;
        }

        for (const persistRectangle of blockIgnoringExistRectangles) {
            if (!rectangles.find((newRectangle) => isSameRectangle(persistRectangle, newRectangle))) {
                return true;
            }
        }

        return false;
    };

    const enableOrDisablePersistRectanglesButton = () => {
        const persistRectanglesButton = document.getElementById("updateIgnoring");
        if (isRectanglesChanged()) {
            persistRectanglesButton.classList.remove("disabled");
        } else {
            persistRectanglesButton.classList.add("disabled");
        }
    };

    const openIgnoring = () => {
        DORMarquee.classList.add('hide');
        controlBaseElement.addEventListener('pointerdown', startDrag);
        enableOrDisableRemoveRectButton();
        enableOrDisablePersistRectanglesButton();
    };

    const update = async () => {
        const pid = updateIgnoringButton.getAttribute("data-pid");
        const caseName = updateIgnoringButton.getAttribute("data-caseName");

        document.getElementById("ignoringSaveSpinner").classList.remove("disabled");
        const response = await fetch("ignoring", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pid: pid,
                caseName: caseName,
                // rectangles: rectangles,
                rectangles: ignoringRatio <= 1 ? rectangles : rectangles.map(rectangle => {
                    return {
                        x: rectangle.x * ignoringRatio,
                        y: rectangle.y * ignoringRatio,
                        width: rectangle.width * ignoringRatio,
                        height: rectangle.height * ignoringRatio
                    }
                })
            })
        });

        response.json().then(data => {
            document.getElementById("ignoringSaveSpinner").classList.add("disabled");
            blockIgnoringExistRectangles = [...rectangles];
        });
    };

    const onClickRemove = () => {
        const rectToRectangle = (rect) => {
            return {
                x: rect.getAttribute('x'),
                y: rect.getAttribute('y'),
                width: rect.getAttribute('width'),
                height: rect.getAttribute('height')
            }
        }

        const removeFromRectangles = (rect) => {
            const rectangle = rectToRectangle(rect);
            for (let i=0; i<rectangles.length; i++) {
                if (isSameRectangle(rectangles[i], rectangle)) {
                    rectangles.splice(i, 1);
                }
            }
        };

        const boxesElement = document.getElementById("boxes");
        for (const rect of document.querySelectorAll("#boxes > rect")) {
            if (rect.classList.contains("toRemove")) {
                boxesElement.removeChild(rect);
                removeFromRectangles(rect);
            }
        }

        enableOrDisablePersistRectanglesButton();

        if (isRectanglesChanged()) {
            update();
        }
    };

    const bundleCloseModalActions = () => {
        $('#ignoringModal').on('hidden.bs.modal', function (event) {
            location.reload();
        })
    };

    const updateIgnoringButton = document.getElementById("updateIgnoring");
    const removeRectangleButton = document.getElementById("removeRectangle");
    const openIgnoringButton = document.getElementById("openIgnoring");

    openIgnoringButton.onclick = openIgnoring;
    updateIgnoringButton.onclick = update;
    removeRectangleButton.onclick = onClickRemove;

    resizeIgnoringAreaAndDrawExistRectangles();
    bundleCloseModalActions();
};