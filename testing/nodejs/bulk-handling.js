import fs from "fs";
import path from "path";

const cloneCounting = 100;
const sourcePath = "../baseline/big-size";
const sourceFiles = fs.readdirSync(sourcePath);

const cloneImages = (sourceImage, totalAmount) => {
    let counting = 1;
    while (counting <= totalAmount) {
        const clonedImage = sourceImage.replace("baseline/big-size", "latest").replace(".png", `-${counting}.png`);
        fs.copyFileSync(sourceImage, clonedImage);

        console.log(`cloned image: ${clonedImage}`);
        counting += 1;
    }
};

const bulking = () => {
    for (const sourceFile of sourceFiles) {
        const sourceImage = path.join(sourcePath, sourceFile);
        if (fs.existsSync(sourceImage)) {
            cloneImages(sourceImage, cloneCounting);
        }
    }
};

bulking();