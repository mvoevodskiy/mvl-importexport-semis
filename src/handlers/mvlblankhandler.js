const MVLoaderBase = require('mvloader/src/mvloaderbase');

class MVLBlankHandler extends MVLoaderBase {

    constructor (App, ...config) {
        let localDefaults = {

        };
        super(localDefaults, ...config);
        this.App = App;
    }

    async init() {
        return super.init();
    }

    async initFinish() {
        super.initFinish();
    }

}

module.exports = MVLBlankHandler;