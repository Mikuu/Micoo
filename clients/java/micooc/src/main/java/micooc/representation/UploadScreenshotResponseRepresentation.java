package micooc.representation;

import java.util.ArrayList;
import java.util.List;

public class UploadScreenshotResponseRepresentation {
    private int code;
    private List<String> receivedImages = new ArrayList<>();

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public List<String> getReceivedImages() {
        return receivedImages;
    }

    public void setReceivedImages(List<String> receivedImages) {
        this.receivedImages = receivedImages;
    }
}
