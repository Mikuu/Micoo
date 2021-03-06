package micooc;

import micooc.model.BuildStats;
import micooc.model.InitializedBuild;
import micooc.model.LatestBuildStats;
import org.junit.Test;
import static org.junit.Assert.*;

public class MicoocTest {
//    private final String serviceHost = "http://localhost:8123";
    private final String serviceHost = "http://localhost:3001";

    @Test
    public void testNewBuild() {
        String pid = "PIDb69512a415aa45e8af738c8baae33c0f";
        String buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
        String screenshotDirectory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest";
//        String serviceEngineUrl = serviceHost + "/engine";
        String serviceEngineUrl = "http://localhost:3002";
        String apiKey = "AK717d2c30d38119eb12";

        InitializedBuild initializedBuild = Micooc.newBuild(serviceEngineUrl, apiKey, pid, buildVersion, screenshotDirectory);
        assertTrue(initializedBuild.getPid().equals(pid));
        assertTrue(initializedBuild.getBid().matches("BID\\S+"));
        assertTrue(initializedBuild.getBuildIndex() > 0);
    }

    @Test
    public void testBuildStats() {
        String bid = "BIDaab2fa5e1d304af3a070e6bae591c5aa";
        String apiKey = "AK717d2c30d38119eb12";
        BuildStats buildStats = Micooc.getBuildStats(serviceHost, apiKey, bid);
        assertTrue(buildStats.getStatus().matches("\\S+"));
        assertTrue(buildStats.getResult().matches("\\S+"));
    }

    @Test
    public void testLatestBuildStats() {
        String pid = "PIDb69512a415aa45e8af738c8baae33c0f";
        String apiKey = "AK717d2c30d38119eb12";
        LatestBuildStats latestBuildStats = Micooc.getLatestBuildStats(serviceHost, apiKey, pid);
        assertTrue(latestBuildStats.getBid().matches("BID\\S+"));
        assertTrue(latestBuildStats.getIndex() > 0);
        assertTrue(latestBuildStats.getStatus().matches("\\S+"));
        assertTrue(latestBuildStats.getResult().matches("\\S+"));
    }
}
