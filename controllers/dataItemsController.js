const { dataItems, stockInItems, stockOutItems } = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');

module.exports = {
    createDataItem: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                stock: Joi.number().required(),
                price: Joi.number().required(),
                category: Joi.string().required(),
            });

            const check = schema.validate(
                {
                    name: body.name,
                    stock: body.stock,
                    price: body.price,
                    category: body.category,
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

            const checkData = await dataItems.findOne({
                where: {
                    name: body.name,
                },
            });

            if (checkData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot duplicate data',
                });
            }

            const createDataItem = await dataItems.create({
                name: body.name,
                stock: body.stock,
                price: body.price,
                category: body.category,
            });

            if (!createDataItem) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Unable to create data',
                });
            }

            await stockInItems.create({
                dataItemId: createDataItem.dataValues.id,
                stock: body.stock,
                date: new Date(),
            });

            return res.status(200).json({
                status: 'success',
                message: 'Data has been created',
                data: createDataItem,
            });
        } catch (error) {
            if (
                error.name === 'SequelizeDatabaseError' &&
                error.parent.routine === 'enum_in'
            ) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'Perkakas, Sembako, MCK, Snack, Minuman, and Others only for Category Data Item',
                });
            }
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    updateDataItemById: async (req, res) => {
        const body = req.body;

        try {
            const findData = await dataItems.findOne({
                where: { id: req.params.id },
            });

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            const schema = Joi.object({
                name: Joi.string(),
                price: Joi.number(),
                category: Joi.string(),
            });

            const check = schema.validate(
                {
                    name: body.name,
                    price: body.price,
                    category: body.category,
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

            if (body.name) {
                const checkData = await dataItems.findOne({
                    where: {
                        name: body.name,
                    },
                });

                if (checkData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Cannot duplicate data',
                    });
                }
            }

            await dataItems.update(
                {
                    name: body.name,
                    price: body.price,
                    category: body.category,
                },
                { where: { id: req.params.id } }
            );

            const getData = await dataItems.findOne({
                where: { id: req.params.id },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Data has been updated',
                data: getData,
            });
        } catch (error) {
            if (
                error.name === 'SequelizeDatabaseError' &&
                error.parent.routine === 'enum_in'
            ) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'Perkakas, Sembako, MCK, Snack, Minuman, and Others only for Category Data Item',
                });
            }
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    deleteDataItemsById: async (req, res) => {
        try {
            const findData = await dataItems.findOne({
                where: { id: req.params.id },
            });

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            await dataItems.destroy({ where: { id: req.params.id } });

            return res.status(200).json({
                status: 'success',
                message: 'Delete Success',
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    getDataById: async (req, res) => {
        const stock = req.query.stock;
        const sort = req.query.sort;
        const filter = req.query.filter;
        const date = req.query.date;
        const dateInput = new Date(date);
        let firstDay = new Date(
            dateInput.getFullYear(),
            dateInput.getMonth(),
            1
        );
        let lastDay = new Date(
            dateInput.getFullYear(),
            dateInput.getMonth() + 1,
            1
        );
        let firstMonth = new Date(
            dateInput.getFullYear(),
            dateInput.getMonth(),
            1
        );
        let lastMonth = new Date(
            dateInput.getFullYear() + 1,
            dateInput.getMonth(),
            1
        );
        let lastWeek = new Date(date);
        lastWeek.setDate(lastWeek.getDate() + 7);

        try {
            if (stock == 'in') {
                if (sort == 'date') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['date', 'DESC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (sort == 'stock') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['stock', 'ASC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'day') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: date,
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'week') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: dateInput,
                                        [Op.lt]: lastWeek,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'month') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstDay,
                                        [Op.lt]: lastDay,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'year') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstMonth,
                                        [Op.lt]: lastMonth,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                const findData = await dataItems.findOne({
                    where: { id: req.params.id },
                    include: [
                        {
                            model: stockInItems,
                            as: 'stockinitems',
                            attributes: {
                                exclude: [
                                    'id',
                                    'dataItemId',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                        },
                    ],
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            if (stock == 'out') {
                if (sort == 'date') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['date', 'DESC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (sort == 'stock') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['stock', 'ASC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'day') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: date,
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'week') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: dateInput,
                                        [Op.lt]: lastWeek,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'month') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstDay,
                                        [Op.lt]: lastDay,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'year') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstMonth,
                                        [Op.lt]: lastMonth,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                const findData = await dataItems.findOne({
                    where: { id: req.params.id },
                    include: [
                        {
                            model: stockOutItems,
                            as: 'stockoutitems',
                            attributes: {
                                exclude: [
                                    'id',
                                    'dataItemId',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                        },
                    ],
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            if (stock == 'all') {
                if (sort == 'date') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['date', 'DESC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['date', 'DESC']],
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['date', 'DESC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (sort == 'stock') {
                    if (filter == 'day') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: date,
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'week') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: dateInput,
                                            [Op.lt]: lastWeek,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'month') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstDay,
                                            [Op.lt]: lastDay,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    if (filter == 'year') {
                        const findData = await dataItems.findOne({
                            where: { id: req.params.id },
                            include: [
                                {
                                    model: stockInItems,
                                    as: 'stockinitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                                {
                                    model: stockOutItems,
                                    as: 'stockoutitems',
                                    where: {
                                        date: {
                                            [Op.gte]: firstMonth,
                                            [Op.lt]: lastMonth,
                                        },
                                    },
                                    attributes: {
                                        exclude: [
                                            'id',
                                            'dataItemId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                    },
                                    order: [['stock', 'ASC']],
                                },
                            ],
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['stock', 'ASC']],
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                                order: [['stock', 'ASC']],
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'day') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: date,
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: date,
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'week') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: dateInput,
                                        [Op.lt]: lastWeek,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: dateInput,
                                        [Op.lt]: lastWeek,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'month') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstDay,
                                        [Op.lt]: lastDay,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstDay,
                                        [Op.lt]: lastDay,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'year') {
                    const findData = await dataItems.findOne({
                        where: { id: req.params.id },
                        include: [
                            {
                                model: stockInItems,
                                as: 'stockinitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstMonth,
                                        [Op.lt]: lastMonth,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                            {
                                model: stockOutItems,
                                as: 'stockoutitems',
                                where: {
                                    date: {
                                        [Op.gte]: firstMonth,
                                        [Op.lt]: lastMonth,
                                    },
                                },
                                attributes: {
                                    exclude: [
                                        'id',
                                        'dataItemId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                },
                            },
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                const findData = await dataItems.findOne({
                    where: { id: req.params.id },
                    include: [
                        {
                            model: stockInItems,
                            as: 'stockinitems',
                            attributes: {
                                exclude: [
                                    'id',
                                    'dataItemId',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                        },
                        {
                            model: stockOutItems,
                            as: 'stockoutitems',
                            attributes: {
                                exclude: [
                                    'id',
                                    'dataItemId',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                        },
                    ],
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            const findData = await dataItems.findOne({
                where: { id: req.params.id },
            });

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Retrieve data Success',
                data: findData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },

    getAllData: async (req, res) => {
        const names = req.query.name ? req.query.name : '';
        const category = req.query.category;
        const filter = req.query.filter;
        const min = req.query.min;
        const max = req.query.max;
        try {
            if (names) {
                if (category) {
                    if (filter == 'Price' || filter == 'price') {
                        const findData = await dataItems.findAll({
                            distinct: true,
                            where: {
                                category: category,
                                name: {
                                    [Op.iLike]: '%' + names + '%',
                                },
                                price: {
                                    [Op.gte]: min,
                                    [Op.lte]: max,
                                },
                            },
                        });

                        if (!findData) {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Data not found',
                            });
                        }

                        return res.status(200).json({
                            status: 'success',
                            message: 'Retrieve data Success',
                            data: findData,
                        });
                    }

                    const findData = await dataItems.findAll({
                        distinct: true,
                        where: {
                            category: category,
                            name: {
                                [Op.iLike]: '%' + names + '%',
                            },
                        },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                if (filter == 'Price' || filter == 'price') {
                    const findData = await dataItems.findAll({
                        distinct: true,
                        where: {
                            name: {
                                [Op.iLike]: '%' + names + '%',
                            },
                            price: {
                                [Op.gte]: min,
                                [Op.lte]: max,
                            },
                        },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                const findData = await dataItems.findAll({
                    distinct: true,
                    where: {
                        name: {
                            [Op.iLike]: '%' + names + '%',
                        },
                    },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            if (category) {
                if (filter == 'Price' || filter == 'price') {
                    const findData = await dataItems.findAll({
                        distinct: true,
                        where: {
                            category: category,
                            price: {
                                [Op.gte]: min,
                                [Op.lte]: max,
                            },
                        },
                    });

                    if (!findData) {
                        return res.status(400).json({
                            status: 'failed',
                            message: 'Data not found',
                        });
                    }

                    return res.status(200).json({
                        status: 'success',
                        message: 'Retrieve data Success',
                        data: findData,
                    });
                }

                const findData = await dataItems.findAll({
                    distinct: true,
                    where: {
                        category: category,
                    },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            if (filter == 'Price' || filter == 'price') {
                const findData = await dataItems.findAll({
                    distinct: true,
                    where: {
                        price: {
                            [Op.gte]: min,
                            [Op.lte]: max,
                        },
                    },
                });

                if (!findData) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Data not found',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Retrieve data Success',
                    data: findData,
                });
            }

            const findData = await dataItems.findAll();

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Retrieve data Success',
                data: findData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },
};
