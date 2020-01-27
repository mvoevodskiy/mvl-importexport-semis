const MVLoaderBase = require('mvloader/src/mvloaderbase');

class MVLBlankSemis extends MVLoaderBase{
    static exportConfig = {
        ext: {
            classes: {
                semis: {},
                controllers: {},
                handlers: {},
            },
            configs: {
                controllers: {},
                handlers: {
                    DBHandler: {
                        sequelize: {},
                        models: {
                            // MVLExampleModel: require('./models/mvlblankexample'),
                        }
                    }
                },
                semis: {},
            }
        },
        db: {},
    };

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

module.exports = MVLBlankSemis;