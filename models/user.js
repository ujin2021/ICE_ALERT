const { Model } = require('sequelize')
const Sequelize = require('sequelize')
const { sequelize } = require('.')

module.exports = ((sequelize, DataTypes) => {
    return sequelize.define('user', {
        kakao_id: {
            type: Sequelize.INTEGER(30),
            allowNull: false,
            unique: true
        },
        name:{
            type: Sequelize.STRING(30),
            allowNull: false
        },
        access_token: {
            type: Sequelize.STRING(60),
            allowNull: false
        },
        refresh_token: {
            type: Sequelize.STRING(60),
            allowNull: false
        }
    },
    { timestamp: false, underscored: true, charset: "utf8", collate: "utf8_general_ci" }
    )
})