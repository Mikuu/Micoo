Publish to Maven Central
--

#### upload SNAPSHOT version firstly

- update version in `miccoc/build.gradle`, add `-SNAPSHOT` to the end of `version`.

- clean and build artifacts
```commandline
gradle clean
gradle assemble
```

- publish artifacts
```commandline
gradle publish
```

#### upload Release version secondly

- update version in `miccoc/build.gradle`, do NOT add `-SNAPSHOT` to the end of `version`.

- clean and build artifacts
```commandline
gradle clean
gradle assemble
```

- publish artifacts
```commandline
gradle publish
```

#### publish package

- login to `https://oss.sonatype.org/`,
- click `Staging Repository` on the left menu, then find the repository on the right, its Activity should be Green,
- click `Close` button, progress could be found at `Summary` and `Activity`,
- use `Refresh` button to check latest status, once it's completed, click `Release` button,
- after release, staging repository is Done, new release could be searched in maven central in a while.
