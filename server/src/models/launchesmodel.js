const launchesDatabase = require("./launches.mongo");
const planets = require("./planet.mongo");
const axios = require("axios");
const launches = new Map();
// let latestFlightNumber=100;
// const lauch = {
//     flightNumber: 100, //fligh_number
//     mission: "kepler Exploration x", //name
//     rocket: "Explorer IS1", //rocket.name
//     launchDate: new Date("December 27,2030"), //date_local
//     target: "Kepler-442 b", //not applicable
//     customers: ["ZTM", "NASA"], //payload.customer
//     upcoming: true, //upcoming
//     success: true, //success
// };

const DEFALUT_flightnumber = 100;
const SPACEXURL = "https://api.spacexdata.com/v4/launches/query";

async function populatelaunches() {
    console.log("Downloading launch Data");
    const response = await axios.post(SPACEXURL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                {
                    path: "payloads",

                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });
    if(response.status!=200){
      console.log('Problem Downloading Launch data');
      throw new Error('Error in donwloading launch data');
    }
    const launchdocs = response.data.docs;
    for (const launchdoc of launchdocs) {
        const payloads = launchdoc["payloads"];
        const customers = payloads.flatMap((payload) => {
            return payload["customers"];
        });
        const launch = {
            flightNumber: launchdoc["flight_number"],
            mission: launchdoc["name"],
            rocket: launchdoc["rocket"]["name"],
            launchDate: launchdoc["date_local"],
            upcoming: launchdoc["upcoming"],
            success: launchdoc["success"],
            customers: customers,
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}
async function loadlaunchdata() {
    const firstlaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });
    if (firstlaunch) {
        console.log("Launch Data is already ");
        return;
    }else{
     await populatelaunches()
    }
}
// launches.set(lauch.flightNumber,lauch);
async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function getLateshFlighNumber() {
    const latestlaunch = await launchesDatabase
        .findOne({})
        .sort("-flightNumber");
    if (!latestlaunch) {
        return DEFALUT_flightnumber;
    }
    return latestlaunch.flightNumber;
}

async function getAllLaunches(skip,limit) {
    // return Array.from(launches.values());
    return await launchesDatabase.find(
        {},
        {
            _id: 0,
            __v: 0,
        }
    ).sort({flightNumber:1}).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
    // const planet = await planets.findOne({
    //     keplerName: launch.target,
    // });
    // console.log("inside the save planet");
    // if (!planet) {
    //     throw new Error("No matching Planets was found");
    // }
    console.log("save Launch Insde");
    try {
        await launchesDatabase.findOneAndUpdate(
            {
                flightNumber: launch.flightNumber,
            },
            launch,
            {
                upsert: true,
            }
        );
    } catch (err) {
        console.log(`the err is ${err}`);
    }
}

// launches.get(100)==launch
async function schedulenewlaunch(launch) {
  const planet = await planets.findOne({
        keplerName: launch.target,
    });
    console.log("inside the save planet");
    if (!planet) {
        throw new Error("No matching Planets was found");
    }
    const newFlightNumber = (await getLateshFlighNumber()) + 1;
    const newlaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["ztm", "NASA"],
        flightNumber: newFlightNumber,
    });
    await saveLaunch(newlaunch);
}
// function addNewLauch(launch){
//     latestFlightNumber+=1;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch,{
//             flightNumber:latestFlightNumber,
//             customer:['ztm','nasa'],
//             upcoming:true,
//             success:true,
//     }));
// }
async function abortlaunchByid(launchId) {
    const aborted = await launchesDatabase.updateOne(
        {
            flightNumber: launchId,
        },
        {
            upcoming: false,
            success: false,
        }
    );
    // return aborted.ok===1 && aborted.nModified===1;
    return aborted.modifiedCount === 1;
    // const aborted=launches.get(launchId)
    // aborted.upcoming=false;
    // aborted.success=false;
    // return aborted;
}

module.exports = {
    getAllLaunches,
    loadlaunchdata,
    schedulenewlaunch,
    existsLaunchWithId,
    abortlaunchByid,
};
