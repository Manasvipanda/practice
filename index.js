document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-ip");
    const statscontainer = document.querySelector(".stats-container");
    const easyprogresscircle = document.querySelector(".easy-progress");
    const mediumProgresscircle = document.querySelector(".Medium-progress");
    const hardProgresscircle = document.querySelector(".Hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("Medium-label");
    const hardlabel = document.getElementById("Hard-label");
    const cardstatscontainer = document.querySelector(".stats-card");

    // return true or false based on a regex
    function validusername(username){
        if(username.trim()==""){
            alert("username should not be empty");
            return false;
        }
        //search from chatgpt for regex expression
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("invalid username");
        }
        return isMatching;
    }

    async function fetchsuserdetails(username){
       
        try{
            searchButton.textContent = "searching....";
            searchButton.disabled = true;
            statscontainer.classList.add("hidden");

         //   const response = await fetch(url);


         const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

          const url = 'https://leetcode.com/graphql';
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
            query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n count\n }\n matchedUser(username: $username) {\n submitStats {\n acSubmissionNum {\n      difficulty\n      count\n      submissions\n     }\n     totalSubmissionNum  {\n   difficulty\n  count\n     submissions\n    }\n    }\n}\n}\n    ",
            
            variables: {"username": `${username}`}
        })
        const requestOption = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };

        const response = await fetch(proxyUrl+url, requestOption);

            if(!response.ok) {
                throw new Error("Unable to fetch the user details");
            }
            const parsedata = await response.json();
            console.log("Logging data:", parsedata);

            displayUserdata(parsedata);

            
        }
        catch(error){
            statscontainer.innerHTML = `<p> No data found </p>`

        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;

        }


    }
    
     function updateProgress(solved, total, label, cirlce){
        const progressDegree = (solved/total)*100;
        cirlce.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;

    }


    function displayUserdata(parsedata){
        const totalques = parsedata.data.allquestionscount[0];
        const totaleasyques = parsedata.data.allquestionscount[1];
        const totalmediumques = parsedata.data.allquestionscount[2];
        const totalHardques = parsedata.data.allquestionscount[3];

        const solvedques = parsedata.data.matchedUser.submitStats.acSubmission[0].count;
        const solvedeasyques = parsedata.data.matchedUser.submitStats.acSubmission[1].count;
        const solvedmediumques = parsedata.data.matchedUser.submitStats.acSubmission[2].count;
        const solvedhardques = parsedata.data.matchedUser.submitStats.acSubmission[3].count;
       
        updateProgress(solvedques, totalques);
        updateProgress(solvedeasyques, totaleasyques, easylabel, easyprogresscircle);
        updateProgress(solvedmediumques, totalmediumques, mediumlabel, mediumProgresscircle);
        updateProgress(solvedhardques, totalHardques, hardlabel, hardProgresscircle);

        const cardData = [
        {label: "total submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
         {label: "total Easy submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
          {label: "total Medium submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
           {label: "total Hard submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
        ];

        console.log(cardData);

        cardstatscontainer.innerHTML = cardData.map(
            data => 
        
                `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`

            
        ).join("")



    }

    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
    console.log("loogin username: ", username);

    if(validusername(username)){
        fetchsuserdetails(username);
    }


    })
    

})