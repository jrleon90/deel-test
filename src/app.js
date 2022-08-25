const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {ProfileRepository} = require('./repository/profile.repositoy');
const {ContractRepository} = require('./repository/contract.repository');
const {JobRepository} = require('./repository/job.repository');
const {JobEntity} = require('./entity/job.entity');
const {ContractEntity} = require('./entity/contract.entity');
const {ProfileEntity} = require('./entity/profile.entity');
const app = express();
const profileRepository = new ProfileRepository();
const contractRepository = new ContractRepository();
const jobRepository = new JobRepository();
const jobEntity = new JobEntity();
const contractEntity = new ContractEntity();
const profileEntity = new ProfileEntity();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const userId = req.profile.id;
        const contract = await contractRepository.getContractById(id, userId, transaction);
        await transaction.commit();
        if(!contract) return res.status(404).end();
        res.json(contract);
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json({error: err});
    }
});

app.get('/contracts', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.profile.id;
        const contracts = await contractRepository.getAllUserContracts(userId, transaction);
        await transaction.commit();
        if(!contracts) return res.status(404).end();
        res.json(contracts);
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json({error: err});
    }

})

app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.profile.id;
        const jobs = await jobRepository.getAllUnpaidJobs(transaction);
        await transaction.commit();
        const filterJobs = jobEntity.filterUnpaidJobsByUser(jobs, userId);
        res.json(filterJobs);
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({error: err})
    }

})

app.get('/admin/best-profession', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {start, end} = req.query;
        const jobs = await jobRepository.getPaidJobs(start, end, transaction);
        const topContractor = contractEntity.getTopContractor(jobs);
        const topContractorData = await profileRepository.getProfileById(topContractor.contractorId, transaction);
        await transaction.commit();
        return res.json({profession: topContractorData.profession, benefits: topContractor.benefits});
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({error: err});
    }
})

app.get('/admin/best-clients', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {start, end} = req.query;
        const limit = req.query.limit ? req.query.limit : 2;
        const jobs = await jobRepository.getPaidJobs(start, end, transaction);
        const topClients = contractEntity.getTopClient(jobs, true, limit);
        console.log(topClients);
        const topClientIds = topClients.map(x => x.clientId);
        const topClientsData = await profileRepository.getProfilesByIDs(topClientIds, transaction);
        await transaction.commit();
        const response = profileEntity.formatTopClientsResponse(topClients, topClientsData);
        return res.json(response);
    } catch (err) {
        await transaction.rollback();
        return res.status(500).json({error: err});
    }

})

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const jobId = req.params.job_id;
        const jobData = await jobRepository.getJobById(jobId, transaction);
        if (jobData.paid) return res.status(400).json({error: 'Job already Paid'});
        const contractorId = jobData.Contract.ContractorId;
        const clientId = jobData.Contract.ClientId;
        const clientData = await profileRepository.getProfileById(clientId, transaction);
        if (clientData.balance < jobData.price) return res.status(400).json({error: 'Not enough funds to make the payment'});
        await Promise.all([
            profileRepository.updateBalance(contractorId, clientId, jobData.price, transaction),
            jobRepository.payJob(jobId, transaction)
        ]);
        await transaction.commit();
        return res.json({message: 'Balance updated'});
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json({error: err});
    }

})

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const clientId = req.params.userId;
        const {amount} = req.body;
        const clientData = await profileRepository.getProfileById(clientId, transaction);
        if (clientData.type !== 'client') return res.status(400).json({error: 'User not a Client'});
        const clientContracts = await contractRepository.getAllUserContracts(clientId, transaction);
        const contractIds = clientContracts.map(x => x.id);
        const jobsData = await jobRepository.getUnpaidJobsByContractId(contractIds, transaction);
        const maxDeposit = jobEntity.calculateMaxDeposit(jobsData);
        if (amount > maxDeposit) return res.status(400).json({error: 'Amount to deposit is exceeds limit (25% of debts)'});
        await profileRepository.addBalance(clientId, amount, transaction);
        const newBalance = parseFloat((clientData.balance + amount).toFixed(2));
        await transaction.commit();
        return res.json({
            message: 'Balance updated', 
            fullName: `${clientData.firstName} ${clientData.lastName}`,
            balance: newBalance
        });

    } catch (err) {
        await transaction.rollback();
        return res.status(500)
    }
})

app.get('/health', async (req, res) => {
    return res.json({message: 'OK'});
})
module.exports = app;
