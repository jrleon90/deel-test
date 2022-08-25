class JobEntity {
    filterUnpaidJobsByUser(jobs, userId) {
        return jobs.filter(x => x.Contract.ContractorId === userId || x.Contract.ClientId === userId);
    }

    calculateMaxDeposit(jobs) {
        const totalToPay = jobs.reduce((acc, val) => acc + val.price, 0);
        return totalToPay*0.25.toFixed(2);
    }
}

module.exports = {
    JobEntity
}