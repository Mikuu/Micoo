package micoo;

import micooc.Micooc;
import micooc.model.BuildStats;
import micooc.model.InitializedBuild;
import micooc.model.LatestBuildStats;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AppTest {

    private final String serviceHost = "http://localhost:8123";

    @Test
    public void testNewBuild() {
        String pid = "PIDc3ac134737084e6596e52b8de1d4be39";
        String buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
        String screenshotDirectory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest";
        String serviceEngineUrl = serviceHost + "/engine";
        String apiKey = "AK005fca5cbc9779755f";

        InitializedBuild initializedBuild = Micooc.newBuild(serviceEngineUrl, apiKey, pid, buildVersion, screenshotDirectory);
        assertEquals(initializedBuild.getPid(), pid);
        assertTrue(initializedBuild.getBid().matches("BID\\S+"));
        assertTrue(initializedBuild.getBuildIndex() > 0);
    }

    @Test
    public void testBuildStats() {
        String bid = "BIDbb74df6671a6428c9325ae4265efc7ab";
        String apiKey = "AK005fca5cbc9779755f";
        BuildStats buildStats = Micooc.getBuildStats(serviceHost, apiKey, bid);
        assertTrue(buildStats.getStatus().matches("\\S+"));
        assertTrue(buildStats.getResult().matches("\\S+"));
    }

    @Test
    public void testLatestBuildStats() {
        String pid = "PIDc3ac134737084e6596e52b8de1d4be39";
        String apiKey = "AK005fca5cbc9779755f";
        LatestBuildStats latestBuildStats = Micooc.getLatestBuildStats(serviceHost, apiKey, pid);
        assertTrue(latestBuildStats.getBid().matches("BID\\S+"));
        assertTrue(latestBuildStats.getIndex() > 0);
        assertTrue(latestBuildStats.getStatus().matches("\\S+"));
        assertTrue(latestBuildStats.getResult().matches("\\S+"));
    }

}
