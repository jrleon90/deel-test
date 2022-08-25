const {sequelize, Job} = require('../model')
const { Op } = require('sequelize');

class ContractRepository {
    constructor() {
        this.contract = sequelize.models.Contract;
    }

    getContractById(contractId, userId, transaction) {
        return new Promise((resolve, reject) => {
            this.contract.findOne({where: 
                {
                    [Op.and]: [
                        {
                            id: contractId
                        }
                    , 
                        {
                            [Op.or]: 
                            [
                                {
                                    ContractorId: userId
                                }, 
                                {
                                    ClientId: userId
                                }
                            ]
                        }
                    ]
                }
            },
            {transaction, lock: true}
            )        
            .then(resolve)
            .catch(reject)
        })
    }

    getAllUserContracts(userId, transaction) {
        return new Promise((resolve, reject) => {
            this.contract.findAll({where:
                {
                    [Op.and]: [
                    {
                        status: 'in_progress'
                    },
                    {
                        [Op.or]: 
                        [
                            {
                                ContractorId: userId
                            }, 
                            {
                                ClientId: userId
                            }
                        ]  
                    }
                ]
            }
            },
            {
                transaction,
                lock: true
            })
            .then(resolve)
            .catch(reject);
        })
    }

    getAllClientContracts(clientId, transaction) {
        return new Promise((resolve, reject) => {
            this.contract.findAll({where: { 
                ClientId: clientId
            },
            include: Job
        }, {
            transaction,
            lock: true
        })
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = {
    ContractRepository
}