const {ProfileEntity} = require('../entity/profile.entity');
const {expect} = require('chai');

describe('Profile entity Tests', function() {
    it('Should format a response', function() {
        const entity = new ProfileEntity();
        const mockProfile = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe'
            },
            {
                id: 2,
                firstName: 'Mickey',
                lastName: 'Mouse'
            },
            {
                id: 3,
                firstName: 'Bruce',
                lastName: 'Wayne'
            },
        ];
        const mockPaidData = [
            {
                clientId: 1,
                paid: 200
            },
            {
                clientId: 2,
                paid: 100
            },
            {
                clientId: 3,
                paid: 500
            },
            
        ];
        const response = entity.formatTopClientsResponse(mockPaidData, mockProfile);
        expect(response).to.have.length(3);
        expect(response[0].paid).to.equal(500);
        expect(response[1].paid).to.equal(200);
        expect(response[2].paid).to.equal(100);
    })

})