class ProfileEntity {
    formatTopClientsResponse(paidData, profileData) {
        const profileMap = new Map();
        for (const profile of profileData) {
            profileMap.set(profile.id, profile);
        }
        const response = [];
        for (const paid of paidData) {
            const profile = profileMap.get(paid.clientId);
            const obj = {
                id: profile.id,
                fullName: `${profile.firstName} ${profile.lastName}`,
                paid: paid.paid
            };
            response.push(obj);
        }
        return response.sort((a, b) => b.paid - a.paid);
    }
}

module.exports = {
    ProfileEntity
}