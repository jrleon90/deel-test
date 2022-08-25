class ContractEntity {
    getTopContractor(jobs, client = false) {
        
        const profileMap = this.setMap(jobs, client);

        let topContractor = -1;
        let maxPrice = 0;
        profileMap.forEach((value, key) => {
            if (value > maxPrice) {
                maxPrice = value;
                topContractor = key;
            }
        });
        return {
            contractorId: topContractor,
            benefits: maxPrice
        };
    }

    getTopClient(jobs, client, limit) {
        const profileMap = this.setMap(jobs, client);
        const profileArr = Array.from(profileMap);
        const profileArrSorted = profileArr.sort((a, b) => b[1] - a[1]);
        const response = [];
        for (let i = 0; i < limit; i++) {
            const obj = {
                clientId: profileArrSorted[i][0],
                paid: profileArrSorted[i][1]
            }
            response.push(obj);
        }
        return response;
    }

    setMap(jobs, client) {
        const contractorMap = new Map();
        let typeProfile = 'ContractorId';
        if (client) typeProfile = 'ClientId';
        jobs.forEach(x => {
            const contractorId = x.Contract[typeProfile];
            if (contractorMap.has(contractorId)) {
                let value = contractorMap.get(contractorId);
                contractorMap.set(contractorId, value + x.price);
            } else {
                contractorMap.set(contractorId, x.price);
            }
        });
        return contractorMap;
    }
}

module.exports = {
    ContractEntity
}