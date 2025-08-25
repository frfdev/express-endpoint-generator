const fs = require('fs')
const path = require('path')
const { toPascalCase, toCamelCase } = require('./utils')

process.stdout.write("nombre del endpoint: ")
process.stdin.setEncoding('utf-8')
process.stdin.on('data', (input) =>{
    const endpoint = toPascalCase(input.trim())

    const dir = path.join('./output')
    const dirRouter = path.join('./output/router')
    const dirSchema = path.join('./output/schemas')
    const dirSerivice = path.join('./output/services')

    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true})
    }

    if(!fs.existsSync(dirRouter)){
        fs.mkdirSync(dirRouter, { recursive: true})
    }

    if(!fs.existsSync(dirSchema)){
        fs.mkdirSync(dirSchema, { recursive: true})
    }

    if(!fs.existsSync(dirSerivice)){
        fs.mkdirSync(dirSerivice, { recursive: true})
    }

    const routerIndexFile = path.join(dirRouter+'/index.js')
    const routerEndpointFile = path.join(dirRouter+'/'+toCamelCase(endpoint)+'.router.js')
    const schemaEndpointFile = path.join(dirSchema+'/'+toCamelCase(endpoint)+'.schema.js')
    const serviceEndpointFile = path.join(dirSerivice+'/'+toCamelCase(endpoint)+'.service.js')

    const routerIndexData = `
const express = require("express");
const ${toCamelCase(endpoint)}Router = require("./${toCamelCase(endpoint)}.route");

function routerApi(app) {
    const router = express.Router();
    app.use("/api/v1", router);
    router.use('/${toCamelCase(endpoint).toLowerCase()}', ${toCamelCase(endpoint)}Router);

    router.get('*', (req, res) => {
        res.status(404).json({
            message: 'Endpoint no existe'
        })
    })

    router.post('*', (req, res) => {
        res.status(404).json({
            message: 'Endpoint no existe'
        })
    })

    router.put('*', (req, res) => {
        res.status(404).json({
            message: 'Endpoint no existe'
        })
    })

    router.delete('*', (req, res) => {
        res.status(404).json({
            message: 'Endpoint no existe'
        })
    })
}

module.exports = routerApi;    
    
    `
    const routerData = `
const express = require("express");
const ${endpoint}Service = require("../services/${toCamelCase(endpoint)}.service");
const validatorHandler = require("../middlewares/validator.handler");
const {
    create${endpoint}Schema,
    getAll${endpoint}Schema,
    find${endpoint}Schema,
    update${endpoint}Schema,
    delete${endpoint}Schema
} = require("../schemas/${toCamelCase(endpoint)}.schema");

const router = express.Router();
let thisService = new ${endpoint}Service()

router.get(
    "/all",
    validatorHandler(getAll${endpoint}Schema, "params"),
    async (req, res, next) => {
        try {
            const ${toCamelCase(endpoint)}Record = await thisService.getAll(data);
            res.status(201).json({
                ${toCamelCase(endpoint)}Record,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/find/:id",
    validatorHandler(find${endpoint}Schema, "params"),
    async (req, res, next) => {
        try {
            const ${toCamelCase(endpoint)}Record = await thisService.find(data);
            res.status(201).json({
                ${toCamelCase(endpoint)}Record,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/new",
    validatorHandler(create${endpoint}Schema, "body"),
    async (req, res, next) => {
        try {
            const body = req.body;
            const ${toCamelCase(endpoint)}Record = await thisService.create(body);
            res.status(201).json({
                ${toCamelCase(endpoint)}Record,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/update/:id",
    validatorHandler(update${endpoint}Schema, "body"),
    async (req, res, next) => {
        try {
            const body = req.body;
            const [ id ] = req.params;
            const ${toCamelCase(endpoint)}Record = await thisService.update(body, id);
            res.status(201).json({
                answer,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('delete/:id',
    validatorHandler(delete${endpoint}Schema, "params"),
    async (req, res, next) => {
      try {
            const [ id ] = req.params;
            const ${toCamelCase(endpoint)}Record  = await thisService.delete(data);
            res.status(201).json({
              ${toCamelCase(endpoint)}Record,
            });
      } catch (error) {
          next(error);
      }
    }
);

module.exports = router;
    `
    const schemaData = `

const Joi = require("joi");

const number = Joi.number()
const string = Joi.string()
const array = Joi.array()
const boolean = Joi.bool()
const object = Joi.object()

const create${endpoint}Schema = Joi.object({

})

const getAll${endpoint}Schema = Joi.object({

})

const find${endpoint}Schema = Joi.object({
    
})

const update${endpoint}Schema = Joi.object({
    
})

const delete${endpoint}Schema = Joi.object({
    
})

module.exports = { create${endpoint}Schema, getAll${endpoint}Schema,  find${endpoint}Schema,  update${endpoint}Schema, delete${endpoint}Schema }; 

    `
    const serviceData = `

const { QueryTypes } = require("sequelize");
const { initializeConnection } = require("../libs/sequelize");
const crypto = require("crypto");

class ${endpoint}Service {
    constructor() {}

    async create(data) {

        const sequelize = await initializeConnection(data.bd);

        try {
            return {
                success: true,
                data: "",
                message: 'sucursal creado'
            };

        } catch (error) {

            return {
                success: false,
                 data: "",
                 message: ""
            };
        }
    }

    async getAll(bd) {

        const sequelize = await initializeConnection(data.bd);

        try {

            return {
                success: true,
                data: "",
                message: ""
            };

        } catch (error) {
                return {
                success: false,
                data: "",
                message: ""
            };
        }
    }

    async update(data) {

        const sequelize = await initializeConnection(data.bd);

        try {

            return {
                success: true,
                data: "",
                 message: ""
            };

        } catch (error) {
            return {
                success: false,
                data: "",
                message: ""
            };
        }
    }

    async delete(data) {

        const sequelize = await initializeConnection(data.bd);

        try {

            return {
                success: true,
                data: "",
                message: ""
            };

        } catch (error) {
            return {
                success: false,
                data: "",
                message: ""
            };
        }
    }
}

module.exports = ${endpoint}Service;
    `

    fs.writeFileSync(path.join(routerIndexFile),routerIndexData,{ encoding: "utf8", flag: "w" })
    fs.writeFileSync(path.join(routerEndpointFile),routerData,{ encoding: "utf8", flag: "w" })
    fs.writeFileSync(path.join(schemaEndpointFile),schemaData,{ encoding: "utf8", flag: "w"})
    fs.writeFileSync(path.join(serviceEndpointFile),serviceData,{ encoding: "utf8", flag: "w"})
    process.exit()
})