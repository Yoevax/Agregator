showDate();
setInterval(showDate, 1000);

function showDate() {
    
    //pour voir l'heure
    let today = new Date();
    let timeVar =  today.toLocaleTimeString('fr-BE'); 
    time.innerText = timeVar;

    //pour voir jour de la semaine
    let dayVar = new Date().toLocaleString('default', {weekday: 'long'});
    day.innerText = dayVar;

    //pour voir date complete
    const options = {year: 'numeric', month: 'long', day: 'numeric' };
    let dateComplete = new Date().toLocaleDateString(undefined, options);
    date.innerText = dateComplete;
 }



 