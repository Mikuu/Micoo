Micoo Dashboard
---

##### launch dashboard
1. run
```commandline
> yarn start
```

##### use VTS
Before start using VTS, you need to prepare a file service, e.g. using http-server, which can serve static files for
the screenshots.

Given you already have the file service, setup the file structure as below:


file service:

    file-server:
    
        assets:
        
            project-team-image: this directory contains project card image used in the Dashboard project page
            
        projects:
        
            [projectName]:
            
                baseline: contains the baseline screenshots
                
                builds: contains each build's screenshots
                
                latest: contains latest build's screenshots


Then, create project through API:
send a Post request to Dashboard service, endpoint, e.g. at localhost
```commandline
http://localhost:3001/project/new
```

with the request body
```json
{
	"projectName": "demo",
	"projectDisplayName": "Demo Project",
	"sharedProjectRootPath": "/Users/Ariman/Workspace/service/exchange/file-server/projects/demo",
	"projectImageUrl": "http://localhost:8080/file-server/assets/project-team-image/team-demo.348x225.webp"
}
```

Note:
1. the *sharedProjectRootPath* must be an accessible path to your running Dashboard service, no matter it's a local path,
or a remote path.

2.  the *projectImageUrl* specify the team card image, must be in *348x225.webp*.

After above setup, VTS Dashboard is ready for use.

#### Start a new project
##### initialize project folders
##### upload project team image
##### create the new project

#### Clean or Delete existing project
##### clean an existing project
##### delete an existing project
