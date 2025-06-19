(function(){

    // Step 1: Generating unique session_id for this visit
    
    const session_id = crypto.randomUUID();


    //Step 2: Define the backend Base url 

    const BASE_URL = "https://shubhang-rulebot.onrender.com/"


    //Step 3: Creat a Reusable Tracker Function 

    const track = (eventType, extaraData = {}) => {
        fetch(`${BASE_URL}/track`, {
            method :"Post",
            headers: {"Content-Type": "application/json"},
            body : JSON.stringify ({
                session_id,
                event: eventType,
                timestamp: new Date().toISOString(),
                ...extraData
            })
        }).catch(err => console.error("Tracking Error:"err));
        };



    //Step 4: Track page laod 

    winodw.addEventListener("load" ,()=>{
        track("page_loaded", {
            page:window.location.pathname
        });
    });


    
    // Step 5 Track button Clicks 

     document.addEventListener("click", (e) =>{
        if(e.target.tagname == "BUTTON"){
        track("button_click", {
            button_text: e.target.innerText,
            button_id: e.target.id || null
          });
        }
     });

    

    //Step 6 : Track inactivity after 30s

    let lastActivity = Date.now();
    const resetTimer = () => lastActivity = Date.now();
     
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);

    setInterval(() =>{
        if (Date.now() - lastActivity > 30000) {
            track("user_inactive_30s");
            resetTimer(); /// Optional reset after firing 
        }
    },500);
})();
