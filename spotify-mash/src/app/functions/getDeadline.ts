export function getDeadline() {
    const res = fetch(`api/leaderboard/deadline/`,
        {
            // cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
    return res
}