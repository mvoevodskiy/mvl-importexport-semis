const MVLoaderBase = require('mvloader/src/mvloaderbase');

class mvlbaImportExportController extends MVLoaderBase {

    constructor (App, config = {}) {
        let localDefaults = {
            handler: 'ExcelHandler',
            exportPath: process.cwd() + '/export/',
        };
        super(localDefaults, config);
        this.App = App;
    }

    async initFinish() {
        super.initFinish();
        this.Excel = this.App.ext.handlers[this.config.handler];
    }

    async addIdsFromValues (equals, values = {}, entities = {}) {
        console.log(values);
        let requests = [];
        for (let eq of equals) {
            // console.log('GET IDS FROM ANSWERS. EQ.HUMAN ', eq.human);
            if (eq.human in values) {
                // console.log('GET IDS FROM ANSWERS. EQ IS OWN');
                let request = (eq) => {
                    let where = this.MT.copyObject(eq.where);
                    where[eq.modelField] = this.MT.extract(eq.human, values, '');
                    let hash = JSON.stringify(where) + eq.model;
                    if (hash in entities) {
                        return values[eq.human] = entities[hash] !== null ? entities[hash].id : 0;
                    } else {
                        console.log('GET IDS FROM ANSWERS. WHERE ', where);


                        return this.App.DB.models[eq.model].findOne({where: where})
                            .then(object => {
                                values[eq.field] = object !== null ? object.id : 0;
                                // delete(values[eq.human]);
                            });
                    }
                };
                requests.push(request(eq));
            }
        }
        await Promise.all(requests);
        // console.log('GET IDS FROM ANSWERS. FIELDS ', fields);
        // values = this.MT.merge(values, fields);
        return values;
    }

    async addValuesFromIds (equals, values = {}, entities = {}) {
        // console.log(values);
        // let fields = {};
        let requests = [];
        for (let eq of equals) {
            // console.log('GET IDS FROM ANSWERS. EQ.HUMAN ', eq.field);
            if (eq.field in values) {
                // console.log('GET IDS FROM ANSWERS. EQ IS OWN');
                let request = (eq) => {
                    let where = this.MT.copyObject(eq.where);
                    where['id'] = this.MT.extract(eq.field, values, 0);
                    let hash = JSON.stringify(where) + eq.model;
                    if (entities.hasOwnProperty(hash)) {
                        values[eq.human] = entities[hash] !== null ? entities[hash][eq.modelField] : '';
                        return true;
                    } else {
                        // console.log('GET IDS FROM ANSWERS. WHERE ', where);

                        return this.App.DB.models[eq.model].findOne({where: where})
                            .then(object => {
                                values[eq.human] = object !== null ? object[eq.modelField] : '';
                                // delete(values[eq.field]);
                            });
                    }
                };
                requests.push(request(eq));
            }
        }
        await Promise.all(requests);
        // console.log('GET IDS FROM ANSWERS. FIELDS ', values);
        // values = this.MT.merge(values, fields);
        return values;
    }

    async export (Model, criteria, fields, options = {}) {
        let rows = [];
        let row = [];
        let entities = {};
        let promises = [];
        let filename = options.filename + '.xlsx' || this.config.exportPath + this.MT.random(10000, 100000) + '.xlsx';
        rows.push(options.captions ? Object.keys(options.captions.byCaption) : fields.list);
        await Model.findAll(criteria)
            .then(results => {
                results.forEach(object => {
                    let method = async () => {
                        let values = await this.addValuesFromIds(fields.equals, object.get(), entities);
                        // console.log('EXPORT. VALUES: ', values);
                        let row = [];
                        for (let key of fields.list) {
                            // if (fields.list.hasOwnProperty(key)) {
                            // console.log('EXPORT. KEY: ', key);
                            row.push(values[key] || '');
                            // }
                        }
                        // console.log('ROW: ', row);
                        return row;
                    };
                    promises.push(method());
                })
            });
        await Promise.all(promises).then(processed => processed.forEach(row => rows.push(row)));
        // console.log('EXPORT. ROWS: ', rows);
        this.Excel.writeFile(filename, rows);
        return filename;
    }
}

module.exports = mvlbaImportExportController;