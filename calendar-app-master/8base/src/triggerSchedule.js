const fetch = require('node-fetch');

module.exports = async event => {
  const res = await fetch('https://calendarappfn.azurewebsites.net/api/orchestrators/scheduleOrchestrator?code=9GMtAT3lT/4Yue46maX5NC9kLrvv6SPver2x0c0OklqG6VFQzsq/Gg==', {
    method: 'POST',
    body: JSON.stringify(event.data),
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await res.json();
  console.log(event, json)
  return json;
};
