const {JobEntity} = require('../entity/job.entity');
const {expect} = require('chai');


describe('Job entity Tests', function() {
    it('Should filter unpaid jobs', function() {
        const entity = new JobEntity();
        const userMock = 2
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

        const response = entity.filterUnpaidJobsByUser(mockJobs, userMock);
        expect(response).to.have.length(2);
        expect(response[0].price).to.equal(200)
    });
    it('Should return the Maximum amount a client can deposit', function() {
        const entity = new JobEntity();
        const mockJobs = [
            {
                id: 1,
                description: 'work',
                price: 100,
                paid: null,
                paymentDate: null,
                Contract: {
                    ContractorId: 5,
                    ClientId: 2
                }
            },
            {
                id: 2,
                description: 'work',
                price: 200,
                paid: 1,
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
        const response = entity.calculateMaxDeposit(mockJobs);
        expect(response).to.equal(105)
    })
})
