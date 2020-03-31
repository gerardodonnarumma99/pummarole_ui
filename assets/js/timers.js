const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';
const TOMATO_TYPE='tomato';
const PAUSE_TYPE='pause';
const SHORT_TOMATO=2;

class Tomato{
    constructor()
    {
        this.tomatoTimer=document.getElementById('tomatoTimer');
        this.pauseTimer=document.getElementById('pauseTimer');
        this.playTomato=document.getElementById('playTomato');
        this.playPause=document.getElementById('playPause');
        this.brokenTomato=document.getElementById('brokenTomato');
        this.brokenPause=document.getElementById('brokenPause');
        this.selectPause=document.getElementById('selectPause');
        this.selectTomato=document.getElementById('selectTomato');
        this.tomatoTitle=document.getElementById('tomatoTitle');
        this.tomatoDescription=document.getElementById('tomatoDescription');
        this.resetCycle=document.getElementById('resetCycle');

        this.first='no';

        //Timer
        this.timerT=new easytimer.Timer();
        this.timerP=new easytimer.Timer();

        this.initListeners();
        this.loadTimer(false);
        this.loadTimerType();
        //this.loadLastTomato();
    }

    initListeners()
    {
        //Resetta ciclo
        this.resetCycle.addEventListener('click',(e) => {
            this.first="yes";
            this.playTimerTomato(2); //Modificarlo successivamente con 25 min
        });

        //Play tomato
        this.playTomato.addEventListener('click',(e) => {
            this.playTimerTomato(this.selectTomato.value);
        });

        //Broken tomato
        this.brokenTomato.addEventListener('click',(e) =>{
            this.timerT.stop();

            //this.startSound("terminated");
            $(this.tomatoTimer).html("00:00:00");
            this.loadTimer(true);
        });

        //Play pause
        this.playPause.addEventListener('click',(e) => {
            this.playTimerPause(this.selectPause.value);
        });

        //Broken pause
        this.brokenPause.addEventListener('click',(e) =>{
            this.timerP.stop();
            this.brokenPause.setAttribute("disabled","");
            $(this.pauseTimer).html("00:00:00");
            this.loadTimer(true);
        });

        //Scorre il tempo del Tomato e vede quando termina
        this.timerT.addEventListener('secondsUpdated', (e) => {
            $(this.tomatoTimer).html(this.timerT.getTimeValues().toString());
          });
        this.timerT.addEventListener('targetAchieved', (e) => {
            $(this.tomatoTimer.values).html('00:00:00');
            this.notifyMe();
            this.loadTimer(false);
          });
          
        //Scorre il tempo della Pausa e vede quando termina
        this.timerP.addEventListener('secondsUpdated', (e) => {
            $(this.pauseTimer).html(this.timerP.getTimeValues().toString());
          });
        this.timerP.addEventListener('targetAchieved', (e) => {
            $(this.pauseTimer.values).html('00:00:00');
            this.notifyMe();
            this.loadTimer(false);
          });
    }

    /**
     * Inizializza il timer del Tomato
     * @param {Di quanti secondi è il timer} startSeconds 
     */
    startTimerTomato(startSeconds)
    {
        this.timerT.start({ countdown: true, startValues: { seconds: startSeconds } });
    }

    /**
     * Inizializza il timer della Pausa
     * @param {Di quanti secondi è il timer} startSeconds 
     */
    startTimerPause(startSeconds)
    {
        this.timerP.start({ countdown: true, startValues: { seconds: startSeconds } });
    }

    async loadTimer(broken)
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/timer/${1}`);
            await this.loadLastForTomatos();
            await this.loadLastTomato();
            await this.pomodoroCycle(); //Controllo ciclo di pomo
            await this.nextTimer();
            await this.controllButton();
            const tomato=result.data;
            console.log(tomato);
            for(const t of tomato)
            {
               // this.changeIcon(t.type,t.status); //Controllo icone old

                if(t.end_date==null)
                {
                    //Calcolo date...
                    let startDate=moment(t.start_date);
                    let now=moment();
                    let diffDate=now.diff(startDate,'minutes');
                    if( (diffDate>=t.duration)||(broken))
                    {
                        
                        if(broken)
                            status="broken";
                        else
                            status="done";
                        
                        //Prendo la data di inizio e aggiungo la durata
                        let datePlus=now.add(t.duration,'minutes').format();
                        //Chiamata PUT
                        this.putTimer(t.id,t.user_id,t.start_date,datePlus,status,t.timer_type);

                        return;
                    }
                    else if(diffDate<t.duration)
                    {
                        let diffDateSeconds=(t.duration*60)-now.diff(startDate,'seconds');
                        console.log(diffDateSeconds);
                        if(t.type==TOMATO_TYPE)
                        {
                            //this.brokenTomato.removeAttribute("disabled");

                            this.startTimerTomato(diffDateSeconds);
                            this.brokenTomato.removeAttribute("disabled");
                            this.controllButton();
                        }
                        else if(t.type==PAUSE_TYPE)
                        {
                            //this.brokenPause.removeAttribute("disabled");

                            this.startTimerPause(diffDateSeconds);
                            this.brokenPause.removeAttribute("disabled");
                            this.controllButton();
                        }
                    }
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /**
     * Avvia un tomato di 25 min
     */
    async playTimerTomato(time)
    {
        this.tomatoForm=document.getElementById('tomatoForm');
        if(!this.tomatoForm.checkValidity())
        {
            return;
        }
        try{
            //Richiesta post
            const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":1,
            "start_date":moment(Date.now()).format(),
            "end_date":"",
            "status":"doing",
            "timer_type":$(this.selectTomato).find(':selected').attr('data-id'),
            "title": this.tomatoTitle.value,
            "description": this.tomatoDescription.value,
            "first_cycle": this.first
          });
          if(result.status===200)
          {
            this.resetForm();
            this.startTimerTomato(time*60);
            this.loadTimer(false);
          }
        }catch(err){
            console.log(err);
        }
    }

    /**
     * Avvia una pausa di 5 min
     */
    async playTimerPause(time)
    {
        try{
            //Richiesta post
            const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":1,
            "start_date":moment(Date.now()).format(),
            "end_date":"",
            "status":"doing",
            "timer_type":$(this.selectPause).find(':selected').attr('data-id'),
            "title":"",
            "description":"",
            "first_cycle":this.first
          });
          if(result.status===200)
          {
            this.startTimerPause(time*60);
            this.loadTimer(false);
          }
        }catch(err){
            console.log(err);
        }
    }

    async putTimer(id,userId,startDate,endDate,status,timerType)
    {
        try{
            //Richiesta post
            const result=await axios.put(TOMATOS_API+'/timer/'+id, {
            "user_id":userId,
            "start_date":startDate,
            "end_date":endDate,
            "status":status,
            "timer_type":timerType
          });
        if(result.status===200)
        {
            this.loadTimer(false);
        }
        }catch(err){
            console.log(err);
        }
    }

    /**
     * Controlla i bottoni da abilitare e disabilitare.
     * Metodo di supporto per loadTimer().
     * @param {Tipo di timer} timerType 
     * @param {Data di fine} timerEndDate 
     * @param {true se è stato attivato un broken, false altrimenti} brokenButton 
     */
    async controllButton(timerType,timerEndDate,brokenButton)
    {
        if(this.timerT.isRunning())
        {
            this.playTomato.setAttribute("disabled","");
            this.playPause.setAttribute("disabled","");

            this.brokenPause.setAttribute("disabled","");
            this.brokenTomato.removeAttribute("disabled");

            this.resetCycle.setAttribute("disabled","");

            this.resetCycle.setAttribute("disabled","");
            
            //Attivo task in corso
            document.getElementById('tomatoForm').setAttribute("hidden","");
            document.getElementById('taskInLoad').removeAttribute('hidden');
            document.getElementById('taskInLoad').innerHTML="In corso...<br>Task title: "+document.getElementById('taskInLoad').getAttribute('data-title')+"<br>Description: "+document.getElementById('taskInLoad').getAttribute('data-description');

            this.resetForm();

        }
        else if(this.timerP.isRunning())
        {
            this.playPause.setAttribute("disabled","");
            this.playTomato.setAttribute("disabled","");

            this.brokenTomato.setAttribute("disabled","");
            this.brokenPause.removeAttribute("disabled");

            this.resetCycle.setAttribute("disabled","");

            this.resetCycle.setAttribute("disabled","");

            //Attivo task in corso
            document.getElementById('tomatoForm').setAttribute("hidden","");
            document.getElementById('taskInLoad').removeAttribute('hidden');
            document.getElementById('taskInLoad').innerHTML="In corso...<br>Task title: "+document.getElementById('taskInLoad').getAttribute('data-title')+"<br>Description: "+document.getElementById('taskInLoad').getAttribute('data-description');

            this.resetForm();

        }
        else
        {
            this.brokenPause.setAttribute("disabled","");
            this.brokenTomato.setAttribute("disabled","");

            this.playTomato.removeAttribute("disabled");
            this.playPause.removeAttribute("disabled");

            this.resetCycle.removeAttribute("disabled");

            this.tomatoTitle.removeAttribute("disabled");
            this.tomatoDescription.removeAttribute("disabled");

            this.resetCycle.removeAttribute("disabled");

            document.getElementById("nextTimer").innerHTML="";

            //Disattivo task in corso
            document.getElementById('taskInLoad').setAttribute("hidden","");
            document.getElementById('tomatoForm').removeAttribute('hidden');
        }
       
    }

    /**
     * Inizializza le select della Pausa e dei Tomato
     */
    async loadTimerType()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/timersTypes`);
            await this.loadLastTomato();
            const type=result.data;
            console.log(type);
            let contT=0,contP=0;
            for(const t of type)
            {
                if(t.type=="tomato")
                {
                    if(contT==0)
                        this.selectTomato.innerHTML+='<option value='+t.duration+' id='+t.duration+' data-id='+t.id+' selected>'+t.description+'</option>';
                    else
                        this.selectTomato.innerHTML+='<option value='+t.duration+' id='+t.duration+' data-id='+t.id+'>'+t.description+'</option>';
                    contT++;
                }
                else if(t.type=="pause")
                {
                    if(contP==0)
                    this.selectPause.innerHTML+='<option value='+t.duration+' id='+t.duration+' data-id='+t.id+' selected>'+t.description+'</option>';
                    else
                        this.selectPause.innerHTML+='<option value='+t.duration+' id='+t.duration+' data-id='+t.id+'>'+t.description+'</option>';
                    contP++;
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    resetForm()
    {
        console.log("Qui");
        this.tomatoTitle.value="";
        this.tomatoDescription.value="";
    }

   /* changeTomatoForm(type)
    {
        if(type==PAUSE_TYPE&&!this.timerP.isRunning())
        {
            this.loadLastTomato();
        }
    } */

    /**
     * Recupera l'ultimo tomato
     */
    async loadLastTomato()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/tomatos/${1}`);
            const tomato=result.data;
            for(const t of tomato)
            {
                console.log(t.title);
                document.getElementById('taskInLoad').setAttribute('data-title',t.title);
                document.getElementById('taskInLoad').setAttribute('data-description',t.description);
                this.tomatoTitle.setAttribute("placeholder","Title precedente: "+t.title);
                this.tomatoDescription.setAttribute("placeholder","Description precedente: "+t.description);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /**
     * Controlla se c'è un pomodoro cycle
     */
    async pomodoroCycle()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/pomodoroCycle/${1}`);
            const cycle=result.data;
            console.log(cycle);
            if(result.status===200&&cycle==true)
            {
                alert("Complimenti! Hai completato un ciclo.");
                this.first="yes";
            }
            else
                this.first="no";
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /**
     * Controlla e setta next timer
     */
    async nextTimer()
    {
        let iconTomato=document.getElementById('iconTomato');
        let iconPause=document.getElementById('iconPause');
        try{
            const result=await axios.get(`${TOMATOS_API}/nextTimer/${1}`);
            const next=result.data[0];
            console.log(next);
            if(result.status===200)
            {
                if(this.timerT.isRunning()||this.timerP.isRunning()) //Se è in corso un timer
                {
                    document.getElementById("nextTimer").innerHTML="Next: "+next.type+" di "+next.duration+" min";
                }
                else if(next.type=='tomato') //Avviso icona per l'utente sul prossimo timer da fare
                {
                    //Mostro icona
                    iconTomato.removeAttribute('hidden');
                    iconPause.setAttribute('hidden',"");
                }
                else if(next.type=='pause')
                {
                    iconPause.removeAttribute('hidden');
                    iconTomato.setAttribute('hidden',"");
                }

                //Seleziono la select giusta a prescindere da tomato o pausa
                document.getElementById(next.duration).setAttribute('selected',"")
            }
            else
            {
                document.getElementById("nextTimer").innerHTML="Avvia un ciclo per suggerimenti";

                iconTomato.setAttribute('hidden',"");
                iconPause.setAttribute('hidden',"");
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /**
     * Recupera gli ultimi 4 timer
     */
    async loadLastForTomatos()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/lastEvent/${1}`);
            const tomato=result.data;
            let table="";
            for(const t of tomato)
            {
                if(t.type=='tomato')
                    table+="<tr><td><i class='fas fa-check'></i></td><td>"+moment(t.start_date).format("DD-MM-YY HH:MM:SS")+"</td><td>"+t.duration+"</td><td>"+t.status+"</td><td>"+t.title+"</td><td>"+t.description+"</td></td>";
                else if(t.type=='pause')
                    table+="<tr><td><i class='fas fa-pause'></i></td><td>"+moment(t.start_date).format("DD-MM-YY HH:MM:SS")+"</td><td>"+t.duration+"</td><td>"+t.status+"</td><td>"+t.title+"</td><td>"+t.description+"</td></td>";
            }
            document.getElementById("tableLastEvent").innerHTML=table;
        }
        catch(err)
        {
            console.log(err);
        }
    }

 /*   changeIcon(type,broken)
    {
        let pauseIcon=document.getElementById("iconPause");
        let tomatoIcon=document.getElementById("iconTomato");
        if(type==TOMATO_TYPE)
        {
            tomatoIcon.setAttribute("hidden","");
            pauseIcon.removeAttribute("hidden");
        }
        else if(type==PAUSE_TYPE)
        {
            tomatoIcon.setAttribute("hidden","");
            pauseIcon.removeAttribute("hidden");
        }
        else if(type==PAUSE_TYPE&&broken=='broken')
        {
            pause.setAttribute("hidden","");
            tomato.removeAttribute("hidden");
        }
        else if(type==PAUSE_TYPE&&broken=='broken')
        {
            tomatoIcon.setAttribute("hidden","");
            pauseIcon.removeAttribute("hidden");
        }
    } */

    notifyMe() {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("Il tuo browser non supporta le notifiche!");
        }
      
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification("Timer terminato!");
        }
      
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Timer terminato!");
            }
          });
        }
      
        // At last, if the user has denied notifications, and you 
        // want to be respectful there is no need to bother them any more.
      }

}

export default new Tomato();