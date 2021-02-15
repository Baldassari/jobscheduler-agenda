const Agenda = require("agenda");

const mongoConnectionString = process.env.CONNECTION_STRING || "mongodb://dev:password@localhost:27017/agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

async function attachJob(name) {
    agenda.define(name, async (job) => {
        console.log(`${job.attrs.name} | Data: ${job.attrs.data}`);
        await job.fail("Test Fail");
    });
    const schedules = generateScheduleDates();

    for (const key in schedules) {
        await agenda.schedule(schedules[key], name, `(${key}) ${schedules[key]}`);
    }
}

function generateScheduleDates() {
    const now = new Date();
    return [addMinutes(now, 0.3), addMinutes(now, 0.5), addMinutes(now, 0.8) ]
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

async function start() {
    await agenda.start();
    let counter = 8;
    while(counter > 0) {
        attachJob("Test@"+counter);
        counter--;
    }
}

start().then(() => console.log("Agenda Started !"));