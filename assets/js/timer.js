const TOMATOS_API = 'http://127.0.0.1:8000/api/v1'

class Tomato{
    constructor()
    {
        this.tomatoTimer=document.getElementById('tomatoTimer');
        this.pauseTimer=document.getElementById('pauseTimer');
        this.play=document.getElementById('play');
        this.pauseTimer=document.getElementById('pauseTimer');
        this.playPause=document.getElementById('playPause');

        this.initListeners();
        this.loadTimer();
    }

    initListeners()
    {
        this.playTimerTomato=this.playTimerTomato.bind(this);
        this.play.addEventListener('click',this.playTimerTomato);

        this.playTimerPause=this.playTimerPause.bind(this);
        this.playPause.addEventListener('click',this.playTimerPause);
    }

    startTime(idElement,time,min,sec)
    {
        this.seconds=sec;
        this.minutes=min;

        let interval=setInterval(()=>{
            if(this.seconds==59)
            {
                this.seconds=0;
                this.minutes++;
            }
            if(this.minutes==time)
            {
                idElement.innerHTML='00:00';
                if(this.play.hasAttribute("disabled"))
                    this.play.removeAttribute("disabled");
                else if(this.playPause.hasAttribute("disabled"))
                    this.playPause.removeAttribute("disabled");
                clearInterval(interval);
                return;
            }
            idElement.innerHTML=this.minutes+":"+this.seconds;
            this.seconds++;
        }, 1000);
    }

    async loadTimer()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/timer/${1}`);
            const tomato=result.data;
            console.log(tomato);
            for(const t of tomato)
            {
                if(t.end_date==null)
                {
                    let startDate=moment(t.start_date);
                    let now=moment(Date.now());
                    let diffDate=moment(new Date()).diff(moment(t.start_date),'minutes')
                    if(diffDate>t.duration)
                    {
                        //Prendo la data di inizio e aggiungo la durata
                        let datePlus=moment(new Date).add(t.duration,'minutes').format();
                        //Chiamata PUT
                        this.putTimer(t.id,t.user_id,t.start_date,datePlus,"done",t.timer_type);
                    }
                    else if(diffDate<t.duration)
                    {
                        let diffStart=moment(Date.now()).diff(moment(t.start_date));
                        let start=new Date(diffStart);
                        if(t.duration==25)
                            this.startTime(this.tomatoTimer,t.duration,start.getMinutes(),start.getSeconds());
                        else if(t.duration==5)
                            this.startTime(this.pauseTimer,t.duration,start.getMinutes(),start.getSeconds());
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
    async playTimerTomato()
    {
        if(this.play.hasAttribute("disabled"))
            this.play.removeAttribute("disabled");
        this.playPause.setAttribute("disabled","");
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
            this.startTime(this.tomatoTimer,25,0,0);
          }
        }catch(err){
            console.log(err);
        }
    }

    /**
     * Avvia una pausa di 5 min
     */
    async playTimerPause()
    {
        if(this.playPause.hasAttribute("disabled"))
            this.playPause.removeAttribute("disabled");
        this.play.setAttribute("disabled","");
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
            this.startTime(this.pauseTimer,5,0,0);
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
}

export default new Tomato();