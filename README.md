### CREATE PROJECT:
    npm create vite@latest
    npm install

# run code 
    npm start
### Demo
    https://cbtruong.github.io/ReactJS-QuizzizApp/
### Run code 
    npm start
### Deploy code
    npm install gh-pages --save-dev
    - open file package.json and add to the command below

    "homepage" : "url"
    Example:
    {
    "homepage" : "https://[gitname].github.io/[projectName]",
    "name": "portfolio-website",
    "version": "0.1.0",
    .....
    }
    <!-- ======================================== -->
    add to the command below
    "predeploy":"npm run build"
    "deploy":"gh-pages -d build"
    Example:
        "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "predeploy":"npm run build",
        "deploy":"gh-pages -d build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
        },
### If use vite
    - open file vite.config.js and add to the command below
    export default defineConfig({
      plugins: [react()],
      base:'/[projectGitName]/'
})

# DEPLOY
    Deploy: npm run deploy
