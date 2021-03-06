const { dataItems, stockInItems } = require('../models');
const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

module.exports = {
    createData: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                dataItemId: Joi.number().required(),
                stock: Joi.number().required(),
                date: Joi.date().format('YYYY-M-D').required(),
            });

            const check = schema.validate(
                {
                    dataItemId: body.dataItemId,
                    stock: body.stock,
                    date: body.date,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            if (body.date > today) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot create data for tommorow',
                });
            }

            if (body.date < today) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot create data for date already passed',
                });
            }

            const checkItem = await dataItems.findOne({
                where: { id: body.dataItemId },
            });

            if (!checkItem) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            const createData = await stockInItems.create({
                dataItemId: body.dataItemId,
                stock: body.stock,
                date: body.date,
            });

            if (!createData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Unable create data',
                });
            }

            const getDataItem = await dataItems.findOne({
                where: { id: body.dataItemId },
            });

            await dataItems.update(
                {
                    stock: getDataItem.dataValues.stock + body.stock,
                },
                { where: { id: body.dataItemId } }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Data has been created',
                data: createData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    updateData: async (req, res) => {
        const body = req.body;

        try {
            const checkData = await stockInItems.findOne({
                where: { id: req.params.id },
            });

            if (!checkData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            const schema = Joi.object({
                stock: Joi.number(),
                date: Joi.date().format('YYYY-M-D'),
            });

            const check = schema.validate(
                {
                    stock: body.stock,
                    date: body.date,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            if (body.date > today) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot update data for tommorow',
                });
            }

            if (body.date < today) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot update data for date already passed',
                });
            }

            await stockInItems.update(
                {
                    stock: body.stock,
                    date: body.date,
                },
                { where: { id: req.params.id } }
            );

            if (body.stock) {
                const getDataStock = await dataItems.findOne({
                    where: { id: checkData.dataValues.dataItemId },
                });

                await dataItems.update(
                    {
                        stock:
                            getDataStock.dataValues.stock -
                            checkData.dataValues.stock +
                            body.stock,
                    },
                    { where: { id: getDataStock.dataValues.id } }
                );
            }

            const getData = await stockInItems.findOne({
                where: { id: req.params.id },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Data has been updated',
                data: getData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    deleteData: async (req, res) => {
        const body = req.body;

        try {
            const checkData = await stockInItems.findOne({
                where: { id: req.params.id },
            });

            if (!checkData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            const getStock = await dataItems.findOne({
                where: { id: checkData.dataValues.dataItemId },
            });

            await dataItems.update(
                {
                    stock:
                        getStock.dataValues.stock - checkData.dataValues.stock,
                },
                { where: { id: getStock.dataValues.id } }
            );

            await stockInItems.destroy({ where: { id: req.params.id } });

            return res.status(200).json({
                status: 'success',
                message: 'Data has been deleted',
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },
};
