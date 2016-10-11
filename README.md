# Basic Template
this is a template for the most basic - get going and start working type of build.
## Gulp Commands

* `gulp` - Work on the project in development mode.
* `gulp build` - Minify and compile the project to the `dist/` folder.
* `gulp deploy` - Run tests, minifies and compile the project to the `dist/` folder. Also prompts the user to define a base path for HTML5 mode.

**required files** 
- cdn folder from server. Place in src/ folder

**Note:** `gulp build` automtically updates the base href in the head of `index.html` from `/bbc-women/src/` to `/bbc-women/dist/`. `gulp deploy` will ask you what you want the base path to be. You should enter the path from the root of the server. For example, if you are deploying the project to a directory that will have the url `http://someurl.com/project` you should enter `/project/` at the prompt. If you just hit enter, it will automatically use `/` as the base path.


