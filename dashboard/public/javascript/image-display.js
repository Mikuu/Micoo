const applyImageDisplay = () => {
    const delta = 3;
    let startX;
    let startY;

    const applyWheelzoomListeners = (me, other) => {
        me.addEventListener('wheelzoom.in', function(e) {
            other.doZoomIn();
        });
        me.addEventListener('wheelzoom.out', function(e) {
            other.doZoomOut();
        });
        me.addEventListener('wheelzoom.drag', function(e) {
            other.doDrag(e.detail.bgPosX, e.detail.bgPosY);
        });
    };

    const applyModalListeners = (me, imageModalId) => {
        me.addEventListener('mousedown', function (event) {
            startX = event.pageX;
            startY = event.pageY;
        });

        me.addEventListener('mouseup', function (event) {
            const diffX = Math.abs(event.pageX - startX);
            const diffY = Math.abs(event.pageY - startY);

            if (diffX < delta && diffY < delta) {
                // Click!
                $(`#${imageModalId}`).modal();
            }
        });

    };

    const baselineImage = document.getElementById("baseline");
    const latestImage = document.getElementById("latest");

    if (baselineImage && latestImage) {
        const images = wheelzoom([baselineImage, latestImage]);

        applyWheelzoomListeners(images[0], images[1]);
        applyWheelzoomListeners(images[1], images[0]);

        applyModalListeners(images[0], "baselineModal");
        applyModalListeners(images[1], "latestModal");
    }

}