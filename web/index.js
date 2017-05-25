module.exports=function () {
    const path = require('path');
    const express = require('express');
    const exphbs = require('express-handlebars');
    this.app = express();
    let layoutFolder=path.join(__dirname, 'views/layouts');
    let viewsFolder=path.join(__dirname, 'views');
    let publicFolder=path.join(__dirname, 'public');
    let self = this;
    let route={};

    return {
        setLayoutRoot:(path)=>{
            layoutFolder=path;
        },
        setViewRoot:(path)=>{
            viewsFolder=path;
        },
        setPublicRoot:(path)=>{
            publicFolder=path;
        },

        setRoute:(key,data)=>{
            route[key]=data;
        },
        start:(port)=>{
            console.log('preparing to start')
            self.app.engine('.html', exphbs({
                defaultLayout: 'index',
                extname: '.html',
                layoutsDir:layoutFolder
            }));
            self.app.set('view engine', '.html');

            self.app.set('views',viewsFolder);
            self.app.use(express.static(publicFolder));
            console.log('paths:\t[view]',viewsFolder,'\t[layout]'+layoutFolder+'\t[public]'+publicFolder);

            for(let k in route) {
                for(let t in route[k]){
                    self.app[t](k, (request, response) => {
                        response.render(route[k][t].layout, route[k][t].params)
                    });
                }
            }
            self.app.listen(port);
            console.log('server started',port);
        }
    }
};