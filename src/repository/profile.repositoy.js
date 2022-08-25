const {sequelize} = require('../model')
const { Op } = require('sequelize');

class ProfileRepository {
    constructor() {
        this.profile = sequelize.models.Profile;
    }

    getAllProfile() {
        return new Promise((resolve, reject) => {
            this.profile.findAll().then(resolve).catch(reject);
        })
    }

    getProfilesByIDs(Ids, transaction) {
        return new Promise((resolve, reject) => {
            this.profile.findAll({where: {id: Ids}}, {transaction, lock: true})
                .then(resolve)
                .catch(reject);
        })
    }

    getProfileById(id, transaction) {
        return new Promise((resolve, reject) => {
            this.profile.findOne({where: {id}}, {transaction, lock: true})
                .then(resolve)
                .catch(reject);
        })
    }

    updateBalance(contractorId, clientId, amount, transaction) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.profile.increment({
                    balance: amount
                }, 
                    {where: {id: contractorId}}, 
                    {transaction, lock: true, returning: true}),
                this.profile.decrement({
                    balance: amount
                }, {
                    where: { id: clientId}
                },
                {
                    transaction,
                    lock: true,
                })
            ])
                .then(resolve)
                .catch(reject)
        })
    }

    addBalance(clientId, amount, transaction) {
        return new Promise((resolve, reject) => {
            this.profile.increment({
                balance: amount
            }, {
                where: { 
                    id: clientId
                }
            }, {
                transaction, 
                lock: true,
                returning: true
            }) 
                .then(resolve)
                .catch(reject)
        })        
    }

}

module.exports = {
    ProfileRepository
}