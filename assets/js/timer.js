const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';
const TOMATO_TYPE=1;
const PAUSE_TYPE=2;

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

        //Timer
        this.timerT=new easytimer.Timer();
        this.timerP=new easytimer.Timer();

        this.soundTerminated=createjs.Sound.registerSound({
            src:"/assets/sounds/terminated.mp3",
            id:"terminated"
        });


        this.initListeners();
        this.loadTimer(false);
        this.loadTimerType();
    }

    initListeners()
    {
        //Play tomato
        this.playTomato.addEventListener('click',(e) => {
            this.playTimerTomato(this.selectTomato.value);
        });

        //Broken tomato
        this.brokenTomato.addEventListener('click',(e) =>{
            this.timerT.stop();

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
            this.startSound("terminated");
            this.loadTimer(false);
          });
          
        //Scorre il tempo della Pausa e vede quando termina
        this.timerP.addEventListener('secondsUpdated', (e) => {
            $(this.pauseTimer).html(this.timerP.getTimeValues().toString());
          });
        this.timerP.addEventListener('targetAchieved', (e) => {
            $(this.pauseTimer.values).html('00:00:00');
            this.startSound("terminated");
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
            const tomato=result.data;
            console.log(tomato);
            for(const t of tomato)
            {
                this.controllButton(t.timer_type,t.end_date,broken);

                if(t.end_date==null)
                {
                    //Calcolo date...
                    let startDate=moment(t.start_date);
                    let now=moment();
                    let diffDate=now.diff(startDate,'minutes');
                    if(diffDate>=t.duration||broken)
                    {
                        if(broken)
                            status="borken";
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
                        if(t.timer_type==TOMATO_TYPE)
                        {
                            this.brokenTomato.removeAttribute("disabled");

                            this.startTimerTomato(diffDateSeconds);
                        }
                        else if(t.timer_type==PAUSE_TYPE)
                        {
                            this.brokenPause.removeAttribute("disabled");

                            this.startTimerPause(diffDateSeconds);
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
        
        try{
            //Richiesta post
            const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":1,
            "start_date":moment(Date.now()).format(),
            "end_date":"",
            "status":"doing",
            "timer_type":1
          });
          if(result.status===200)
          {
            this.startTimerTomato(time*60);
            this.loadTimer(false);
            //this.startTimer(this.tomatoTimer,120);
            //this.startTime(this.tomatoTimer,totSeconds);
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
            "timer_type":2
          });
          if(result.status===200)
          {
            this.startTimerPause(time*60);
            this.loadTimer(false);
            //this.startTimer(this.pauseTimer,60);
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
    controllButton(timerType,timerEndDate,brokenButton)
    {
        if(this.timerT.isRunning())
            {
                this.playTomato.setAttribute("disabled","");
                this.playPause.setAttribute("disabled","");
                this.brokenPause.setAttribute("disabled","");
                this.brokenTomato.removeAttribute("disabled");
            }
            else if(this.timerP.isRunning())
            {
                this.playPause.setAttribute("disabled","");
                this.playTomato.setAttribute("disabled","");
                this.brokenTomato.setAttribute("disabled","");
                this.brokenPause.removeAttribute("disabled");
            }
            else
            {
                if(timerType==TOMATO_TYPE)
                {
                    this.playTomato.setAttribute("disabled","");
                    this.brokenTomato.setAttribute("disabled","");
                    this.brokenPause.setAttribute("disabled","");
                    if(timerEndDate==null&&!brokenButton)
                        this.playPause.setAttribute("disabled","");
                    else if(timerEndDate==null&&brokenButton)
                        this.playPause.removeAttribute("disabled");
                    else
                        this.playPause.removeAttribute("disabled");
                }
                else if(timerType==PAUSE_TYPE)
                {
                    this.playPause.setAttribute("disabled","");
                    this.brokenPause.setAttribute("disabled","");
                    this.brokenTomato.setAttribute("disabled","");
                    if(timerEndDate==null&&!brokenButton)
                        this.playTomato.setAttribute("disabled","");
                    else if(timerEndDate==null&&brokenButton)
                        this.playTomato.removeAttribute("disabled");
                    else
                        this.playTomato.removeAttribute("disabled");
                }
            }
    }

    /**
     * Inizializza le select della Pausa e dei Tomato
     */
    async loadTimerType()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/timersTypes`);
            const type=result.data;
            console.log(type);
            let contT=0,contP=0;
            for(const t of type)
            {
                if(t.type=="tomato")
                {
                    if(contT==0)
                        this.selectTomato.innerHTML+='<option value='+t.duration+' selected>'+t.description+'</option>';
                    else
                        this.selectTomato.innerHTML+='<option value='+t.duration+'>'+t.description+'</option>';
                    contT++;
                }
                else if(t.type=="pause")
                {
                    if(contP==0)
                    this.selectPause.innerHTML+='<option value='+t.duration+' selected>'+t.description+'</option>';
                    else
                        this.selectPause.innerHTML+='<option value='+t.duration+'>'+t.description+'</option>';
                    contP++;
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /**
     * Avvia il suono solo se caricato 
     * (Grazie all'evento fileload di Sound.js)
     */
    startSound(id)
    {
        createjs.Sound.addEventListener("fileload", () => {
            //Riproduce il suono con un tale id
            createjs.Sound.play(id);
        });
    }

}

export default new Tomato();