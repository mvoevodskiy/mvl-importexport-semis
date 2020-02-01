const MVLoaderBase = require('mvloader/src/mvloaderbase');
const MVLExcelHandler = require('mvl-excel-handler');

class MVLImportExportSemis extends MVLoaderBase{
    static exportConfig = {
        ext: {
            classes: {
                semis: {},
                controllers: {
                    mvlbaImportExportController: require('./controllers/mvlimportexportcontroller')
                },
                handlers: {
                    ExcelHandler: MVLExcelHandler,
                },
            },
            configs: {
                semis: {},
                controllers: {},
                handlers: {
                    DBHandler: {
                        sequelize: {},
                        models: {}
                    }
                },
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

module.exports = MVLImportExportSemis;