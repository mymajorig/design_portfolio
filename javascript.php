<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button onclick=getCurrentTime(event)>What time is it</button>
    <p id="dateTimeSection">The original inner html</p>

    <script>

            async function fetchJson(url){
                const response = await fetch(url);
                if(!response.ok){
                    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
                }
                return response.json();
            }
            
            async function getCurrentTime(event){
                try{
                    const data = await fetchJson('endpoint.php');
                    document.getElementById("dateTimeSection").textContent = data.date
                } catch(error){
                    console.Error('Error', error);
                    document.getElementById("dateTimeSection").textContent = "couldn't load"
                }


                // fetch('endpoint.php').then(
                //     response =>(
                //         response.json()
                //     )
                // ).then(
                //     data=>(
                //         //do something with data we fetch from endpoint
                //         //format: JSON - ['date' => 'Y-m-d H:i:s'] 
                //         document.getElementById("dateTimeSection").innerHTML = data.date //want the date to replace whats in p#dateTimeSession
                //     ) 
                // ).catch(
                //     error=>{
                //         console.error("oh naur chleaur");
                //     }
                // )
            }
    </script>
</body>
</html>

