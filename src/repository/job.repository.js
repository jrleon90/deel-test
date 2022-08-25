const {sequelize, Contract} = require('../model')
const { Op } = require('sequelize');

class JobRepository {
    constructor() {
        this.job = sequelize.models.Job;
    }

    getJobById(id, transaction) {
        return new Promise((resolve, reject) => {
            this.job.findOne({
                where: 
                {
                    id
                }, 
                include: Contract
            },{
                transaction,
                lock: true
            })
                .then(resolve)
                .catch(reject);
        });
    }

    getAllUnpaidJobs(transaction) {
        return new Promise((resolve, reject) => {
            this.job.findAll({
                where: {
                    paid: null
                },
                include: Contract
        },{
            transaction,
            lock: true
        })
            .then(resolve)
            .catch(reject);
        });
    }

    getUnpaidJobsByContractId(contractId, transaction) {
        console.log('ID', contractId);
        return new Promise((resolve, reject) => {
            this.job.findAll({
                where: {
                    [Op.and]: [
                        {
                            paid: null,
                        },
                        {
                            ContractId: contractId
                        }
                    ]
                }
            },                
            {
                transaction,
                lock: true
            })
                .then(resolve)
                .catch(reject)
        })
    }

    getPaidJobs(start, end, transaction) {
        return new Promise((resolve, reject) => {
            this.job.findAll({
                where: {
                    paid: true,
                    paymentDate: {
                        [Op.gt]: new Date(start),
                        [Op.lt]: new Date(end)
                    }
                },
                include: Contract
            },{
                transaction,
                lock: true
            })
                .then(resolve)
                .catch(reject)
        });
    }

    payJob(jobId, transaction) {
        return new Promise((resolve, reject) => {
            this.job.update({
                paid: true, 
                paymentDate: new Date()}, 
                {
                    where: {id: jobId}
                }, 
                {
                    transaction, 
                    lock: true
                })
                .then(resolve)
                .catch(reject)
        });
    }
}

module.exports = {
    JobRepository
}