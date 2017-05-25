let web = require("./web/index.js")();
const path = require('path');

web.setLayoutRoot(path.join(__dirname,'public/layout'));
web.setPublicRoot(path.join(__dirname,'public/publish'));
web.setViewRoot(path.join(__dirname,'public/view'));
web.setRoute('/',{
    get:{
        layout:'home',
        params:{
            name:'Hi'
        }
    }
});

web.start(9876);