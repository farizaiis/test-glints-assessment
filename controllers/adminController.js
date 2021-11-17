const { admin } = require('../models');
require('dotenv').config();
const Joi = require('joi');
const { generateToken } = require('../helpers/jwt');
const { comparePass } = require('../helpers/bcrypt');

module.exports = {
    signin: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            });

            const check = schema.validate(
                {
                    email: body.email,
                    password: body.password,
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

            const adminEmailData = await admin.findOne({
                where: {
                    email: body.email,
                },
            });

            if (!adminEmailData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'invalid email',
                });
            }

            const checkPass = comparePass(
                body.password,
                adminEmailData.dataValues.password
            );

            if (!checkPass) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'wrong password',
                });
            }

            const payload = {
                role: adminEmailData.dataValues.role,
                email: adminEmailData.dataValues.email,
                id: adminEmailData.dataValues.id,
            };

            const token = generateToken(payload);

            return res.status(200).json({
                status: 'success',
                message: 'sign in successfully',
                token: token,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            });
        }
    },
};
