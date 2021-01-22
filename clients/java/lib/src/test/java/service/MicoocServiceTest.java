package service;

import org.junit.Test;

import micooc.model.BuildStats;
import micooc.model.InitializedBuild;
import micooc.model.LatestBuildStats;
import micooc.service.MicooService;

import static org.junit.Assert.assertTrue;

public class MicoocServiceTest {

    private final String serviceHost = "http://localhost:8123";

    @Test
    public void testNewBuild() {
        String pid = "PIDa9aa03c236a7426cb696e795f43e81f3";
        String buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
        String screenshotDirectory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest";
        String serviceEngineUrl = serviceHost + "/engine";

        InitializedBuild initializedBuild = MicooService.newBuild(serviceEngineUrl, pid, buildVersion, screenshotDirectory);
        assertTrue(initializedBuild.getPid().equals(pid));
        assertTrue(initializedBuild.getBid().matches("BID\\S+"));
        assertTrue(initializedBuild.getBuildIndex() > 0);
    }

    @Test
    public void testBuildStats() {
        String bid = "BID699d387482b743d1b7ceee907d5e3628";
        BuildStats buildStats = MicooService.getBuildStats(serviceHost, bid);
        assertTrue(buildStats.getStatus().matches("\\S+"));
        assertTrue(buildStats.getResult().matches("\\S+"));
    }

    @Test
    public void testLatestBuildStats() {
        String pid = "PIDa9aa03c236a7426cb696e795f43e81f3";
        LatestBuildStats latestBuildStats = MicooService.getLatestBuildStats(serviceHost, pid);
        assertTrue(latestBuildStats.getBid().matches("BID\\S+"));
        assertTrue(latestBuildStats.getIndex() > 0);
        assertTrue(latestBuildStats.getStatus().matches("\\S+"));
        assertTrue(latestBuildStats.getResult().matches("\\S+"));
    }
}
