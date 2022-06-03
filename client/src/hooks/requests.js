async function httpGetPlanets() {
 const response= await fetch('http://localhost:8000/v1/planets')
 return await response.json();
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response=await fetch('http://localhost:8000/v1/launches');
  const fetchedlaung=await response.json();
  return fetchedlaung.sort((a,b)=>{return a.flightNumber<b.flightNumber;});
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try{
    return await fetch('http://localhost:8000/v1/launches',{
    method:'post',
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(launch)
  })
  }catch(err){
    return {
      ok:false,
    }
  }
  
// TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try{
    return await fetch(`http://localhost:8000/v1/launches/${id}`,{
      method:"delete",
    })
  }catch(err){
    console.log(err);
    return {
      ok:false,
    }

  }
 
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};