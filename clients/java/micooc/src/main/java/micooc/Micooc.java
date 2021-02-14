package micooc;

import micooc.model.BuildStats;
import micooc.model.InitializedBuild;
import micooc.model.LatestBuildStats;
import micooc.service.MicooService;

/**
 * Micooc is a Java client to communicate with Visual Testing service Micoo.
 *
 * @author      Biao Fu
 * @version     %I%, %G%
 * @since       1.0
 */
public class Micooc {

    /**
     * Upload SUT screenshots to Micoo to trigger visual testing. New build will only be created when there is at least
     * one screenshot has been successfully uploaded.
     *
     * @param host      the host for Micoo service. When Micoo backend services are launched with docker, this
     *                  shot should be the service IP or hostname plus path /engine, e.g. http://localhost:8123/engine.
     *                  When Micoo backend services are launched separately, e.g. launched from local source code,
     *                  this host should be the engine service's host, e.g. http://localhost:3002.
     * @param apiKey    the Project API Key.
     * @param pid       the PID of the target project in Micoo, e.g. PIDa9aa03c236a7426cb696e795f43e81f3.
     * @param buildVersion         the build version of the current new build, usually it could be a git revision or svn
     *                             version number.
     * @param screenshotsDirectory  the directory path which contains the screenshots to upload to Micoo. Only .png files
     *                              are valid, and filename should match [a-zA-Z0-9\-_&amp;()#]+.png.
     * @return          returns new build bid and its index.
     * @see             InitializedBuild
     * @since           1.0
     */
    public static InitializedBuild newBuild(String host, String apiKey, String pid, String buildVersion, String screenshotsDirectory) {
        return MicooService.newBuild(host, apiKey, pid, buildVersion, screenshotsDirectory);
    }

    /**
     * Get a specific build's test stats.
     *
     * @param host      the host for Micoo service. This is always be the Micoo dashboard service IP or hostname, e.g.
     *                  http://localhost:8123.
     * @param apiKey    the Project API Key.
     * @param bid       the bid of the build to fetch its testing stats, e.g. BID699d387482b743d1b7ceee907d5e3628
     * @return          returns the build's testing stats.
     * @see             BuildStats
     * @since           1.0
     */
    public static BuildStats getBuildStats(String host, String apiKey, String bid) {
        return MicooService.getBuildStats(host, apiKey, bid);
    }


    /**
     * Get testing stats of the latest build for a project in Micoo
     *
     * @param host      the host for Micoo service. This is always be the Micoo dashboard service IP or hostname, e.g.
     *                  http://localhost:8123.
     * @param apiKey    the Project API Key.
     * @param pid       the bid of the project in Micoo, e.g. PIDa9aa03c236a7426cb696e795f43e81f3
     * @return          returns the build's testing stats.
     * @see             LatestBuildStats
     * @since           1.0
     */
    public static LatestBuildStats getLatestBuildStats(String host, String apiKey, String pid) {
        return MicooService.getLatestBuildStats(host, apiKey, pid);
    }
}
