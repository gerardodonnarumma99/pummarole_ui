const TOMATOS_API = 'http://127.0.0.1:8000/api/v1'

class Tomato{
    constructor()
    {
        this.tomatoTimer=document.getElementById('tomatoTimer');
        this.play=document.getElementById('play');
        this.pauseTimer=document.getElementById('pauseTimer');
        this.playPause=document.getElementById('playPause');

        this.initListeners();
        this.loadTimer();
    }

    initListeners()
    {
        this.playTimer=this.playTimer.bind(this);
        this.play.addEventListener('click',this.playTimer);
    }

    startTime(time,min,sec)
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
                this.tomatoTimer.innerHTML='00:00';
                clearInterval(interval);
            }
            this.tomatoTimer.innerHTML=this.minutes+":"+this.seconds;
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
                    //let diffDate=moment(Date.now()).diff(moment(t.start_date),'minutes');
                    let diffDate=moment(t.start_date).diff(moment(new Date()),'minutes')
                    //console.log(diffDate);
                    if(diffDate>25)
                    {
                        console.log("Qui");
                        //Prendo la data di inizio e aggiungo 25
                        let datePlus=moment(new Date).add(25,'minutes').format();
                        //Chiamata PUT
                        this.putTimer(t.id,t.userId,t.start_date,t.end_date,"done",t.timer_type);
                    }
                    else if(diffDate<25)
                    {
                        let diffStart=moment(Date.now()).diff(moment(t.start_date));
                        let start=new Date(diffStart);
                        this.startTime(25,start.getMinutes(),start.getSeconds());
                    }
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    async playTimer()
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
            this.startTime(25,0,0);
          }
        }catch(err){
            console.log(err);
        }
    }

    async putTimer(id,userId,startDate,endDate,status,timerType)
    {
        try{
            //Richiesta post
            const result=await axios.post(TOMATOS_API+'/timer/'+id, {
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