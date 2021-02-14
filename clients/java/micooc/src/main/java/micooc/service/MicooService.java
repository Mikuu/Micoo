package micooc.service;

import micooc.model.BuildStats;
import micooc.model.InitializedBuild;
import micooc.model.LatestBuildStats;
import micooc.representation.UploadScreenshotResponseRepresentation;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.nio.file.Files;


public class MicooService {

    private static final RestTemplate restTemplate = new RestTemplate();

    private static boolean screenshotFileNameFilter(String screenshotFilename) {
        if (screenshotFilename.matches("^[a-zA-Z0-9\\-_&()#]+.png$")) {
            return true;
        }

        System.out.println(screenshotFilename + " filename is not acceptable to [a-zA-Z0-9\\-_&()#]+.png, not to upload");
        return false;
    }

    private static boolean screenshotFileLengthFilter(String screenshotFilename) {
        String fileNameWithOutExt = screenshotFilename.replaceFirst("[.][^.]+$", "");
        if (fileNameWithOutExt.length() < 100) {
            return true;
        }

        System.out.println(screenshotFilename + " filename longer than 100, not to upload");
        return false;
    }

    private static void uploadScreenshot(String uploadScreenshotUrl, String apiKey, MultipartFile image) throws Exception {
        if (!screenshotFileNameFilter(image.getName())){
            return;
        }

        if (!screenshotFileLengthFilter(image.getName())) {
            return;
        }

        ByteArrayResource contentsAsResource = new ByteArrayResource(image.getBytes()){
            @Override
            public String getFilename(){
                return image.getName();
            }
        };

        MultiValueMap<String, Object> postData = new LinkedMultiValueMap<>();
        postData.add("image", contentsAsResource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("x-api-key", apiKey);

        HttpEntity<MultiValueMap<String, Object>> requestEntity
                = new HttpEntity<>(postData, headers);

        ResponseEntity<UploadScreenshotResponseRepresentation> uploadResponseEntity = restTemplate.postForEntity(
                uploadScreenshotUrl, requestEntity, UploadScreenshotResponseRepresentation.class);

        if (uploadResponseEntity.getStatusCodeValue() == 200) {
            System.out.println("uploaded screenshot '" + uploadResponseEntity.getBody().getReceivedImages() + "'");
            return;
        }

        System.out.println("upload screenshot '" + image.getName() + "' failed");

    }

    private static int uploadScreenshots(String uploadScreenshotHost, String apiKey, String pid, File screenshotsDirectory) {
        final String uploadScreenshotUrl = UriComponentsBuilder
                .fromUriString(uploadScreenshotHost)
                .path("/slave/images/project-tests")
                .path("/"+pid)
                .toUriString();

        int counter = 0;

        for (final File screenshot : screenshotsDirectory.listFiles()) {
            try {
                MultipartFile screenshotMultipartFile = new MockMultipartFile(
                        screenshot.getName(),
                        Files.readAllBytes(screenshot.toPath())
                );
                uploadScreenshot(uploadScreenshotUrl, apiKey, screenshotMultipartFile);
                counter += 1;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return counter;
    }

    private static InitializedBuild triggerNewBuild(String initializeBuildHost, String apiKey, String pid, String buildVersion) {
        String initializeBuildUrl = UriComponentsBuilder
                .fromUriString(initializeBuildHost)
                .path("/slave/build/initialize")
                .queryParam("pid", pid)
                .queryParam("buildVersion", buildVersion)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.postForObject(initializeBuildUrl, entity, InitializedBuild.class);
    }

    public static InitializedBuild newBuild(String host, String apiKey, String pid, String buildVersion, String screenshotsDirectory) {
        final File screenshotDirectoryFile = new File(screenshotsDirectory);

        if (!screenshotDirectoryFile.isDirectory() || !screenshotDirectoryFile.exists()) {
            StringBuilder stringBuilder = new StringBuilder();
            String failureMessage =stringBuilder
                    .append("Trigger new build failed, ")
                    .append("screenshot directory '")
                    .append(screenshotDirectoryFile.getAbsolutePath())
                    .append("' is not valid")
                    .toString();
            System.out.println(failureMessage);
            return null;
        }

        int uploadedCounter = uploadScreenshots(host, apiKey, pid, screenshotDirectoryFile);
        if (uploadedCounter > 0) {
            return triggerNewBuild(host, apiKey, pid, buildVersion);
        } else {
            System.out.println("No screenshot uploaded.");
        }

        return null;
    }

    public static BuildStats getBuildStats(String host, String apiKey, String bid) {
        String getBuildStatsUrl = UriComponentsBuilder
                .fromUriString(host)
                .path("/stats/build")
                .queryParam("bid", bid)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange(getBuildStatsUrl, HttpMethod.GET, entity, BuildStats.class).getBody();
    }

    public static LatestBuildStats getLatestBuildStats(String host, String apiKey, String pid) {
        String getLatestBuildStatsUrl = UriComponentsBuilder
                .fromUriString(host)
                .path("/stats/build/latest")
                .queryParam("pid", pid)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange(getLatestBuildStatsUrl, HttpMethod.GET, entity, LatestBuildStats.class).getBody();
    }

}
