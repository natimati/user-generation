export function getFakeUsers(seed: string, region: string, page: number) {
    return fetch(
        'https://randomuser.me/api?results=20&page=' + page + '&seed=' + seed + '&nat=' + region.toLowerCase() + '&inc=name,location,cell', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status)
            }
            return response.json();
        })
        .catch((e) => {
            console.log(e)
            throw e;
        });
};