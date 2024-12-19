console.log("working bro");
const user = JSON.parse(localStorage.getItem('offload-user'));

if (!user) {
  alert('Please log in to access the dashboard.');
  window.location.href = '/login.html';
} else {
  document.getElementById('username').textContent = user.username;
  //  document.getElementById('trigger').textContent = user.trigger;
}

//get all the users agents
loadAgents();

async function loadAgents() {
  const token = localStorage.getItem("offload-token"); // Assuming the JWT token is stored in localStorage

  try {
    const response = await fetch('/api/agents/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Agents fetched!", result);

      //response has all the agents
      renderAgents(result.agents);

    } else {
      console.log("Error getting agents:", result.message);
    }
  } catch (error) {
    console.error("Error making request:", error.message);
  }
}

function renderAgents(agents) {
  // debugger;

  let agentsContainer = document.querySelector("#user-agents");

  for(let a of agents){
    let anchor = document.createElement("a");

    anchor.href = `agent/${a._id}`;  //go to the agents individual page
    anchor.innerHTML = `<div class="model-link"><p>${a.modelName}, ${a.modelDesc}`
    // debugger;
    // if(a.weights){
    //   anchor.href = `agent/${a._id}`;  //go to the agents individual page
    //   anchor.innerHTML = `<div class="model-link"><p>${a.modelName}, ${a.modelDesc}`
    // }  else {
    //   anchor.innerHTML = `<div class="model-link"><p>${a.modelName}, ${a.modelDesc} - training`
    // }
    agentsContainer.append(anchor);
  }
}


