const {ContractEntity} = require('../entity/contract.entity');
const {expect} = require('chai');

describe('Contract entity Tests', function() {
    it('Should get the top contractor', function() {
        const entity = new ContractEntity();
        const mockJobs = [
            {
                id: 1,
                description: 'work',
                price: 100,
                paid: null,
                paymentDate: null,
                Contract: {
                    ContractorId: 5,
                    ClientId: 1
                }
            },
            {
                id: 2,
                description: 'work',
                price: 200,
                paid: null,
                Contract: {
                    ContractorId: 6,
                    ClientId: 2
                }
            },
            {
                id: 3,
                description: 'work',
                price: 120,
                paid: null,
                paymentDate: null,
                Contract: {
                    ContractorId: 5,
                    ClientId: 2
                }
            },
        ];

        const response = entity.getTopContractor(mockJobs);
        expect(response.contractorId).to.equal(5);
        expect(response.benefits).to.equal(220);
    
    });

    it('Should get the Top Client', function() {
        const entity = new ContractEntity();
        const mockJobs = [
            {
                id: 1,
                description: 'work',
                price: 100,
                paid: null,
                paymentDate: null,
                Contract: {
                    ContractorId: 5,
                    ClientId: 1
                }
            },
            {
                id: 2,
                description: 'work',
                price: 200,
                paid: null,
                Contract: {
                    ContractorId: 6,
                    ClientId: 2
                }
            },
            {
                id: 3,
                description: 'work',
                price: 120,
                paid: null,
                paymentDate: null,
                Contract: {
                    ContractorId: 5,
                    ClientId: 2
                }
            },
        ];

        const response = entity.getTopClient(mockJobs, true, 2);
        expect(response).to.have.length(2);
        expect(response[0].clientId).to.equal(2);
        expect(response[0].paid).to.equal(320);
        expect(response[1].clientId).to.equal(1);
        expect(response[1].paid).to.equal(100);
    
    })
})