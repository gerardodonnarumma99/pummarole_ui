import Timers from "./timer.js";

const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';

export default class Pause{
    constructor(timers)
    {
        this.timer=new easytimer.Timer();
        this.select=document.getElementById('selectPause');
        this.pauseId=document.getElementById('pauseTimer');
        this.playBtn=document.getElementById('playPause');
        this.brokenBtn=document.getElementById('brokenPause');
        this.timerId=document.getElementById('pauseTimer');
        this.timers=timers;

        this.initListener();
        this.loadSelect();
    }

    //Metodi get e set

    getTimer()
    {
        return this.timer;
    }

    getTimers()
    {
        return this.timers;
    }

    getPlayBtn()
    {
        return this.playBtn;
    }

    getBrokenBtn()
    {
        return this.brokenBtn;
    }

    getTimerId()
    {
        return this.timerId;
    }

    getSelect()
    {
        return this.select;
    }

    setTimerId(timerId)
    {
        this.timerId=timerId;
    }

    setTimers(timers)
    {
        this.timers=timers;
    }

    initListener()
    {
        
    }

    startTimer(startSeconds)
    {
        this.timer.start({ countdown: true, startValues: { seconds: startSeconds } });
    }

    async playPause()
    {
        this.timers.setUserId(1);
        this.timers.setStartDate(moment(Date.now()).format());
        this.timers.setEndDate("");
        this.timers.setStatus("doing");
        this.timers.setTimerType($(this.select).find(':selected').attr('data-id'));
        this.timers.setTitle("");
        this.timers.setDescription("");
        try{
            //Richiesta post
            const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":this.timers.getUserId(),
            "start_date":this.timers.getStartDate(),
            "end_date":this.timers.getEndDate(),
            "status":this.timers.getStatus(),
            "timer_type":this.timers.getTimerType(),
            "title":this.timers.getTitle(),
            "description": this.timers.getDescription(),
            "first_cycle":this.timers.getFirstCycle()
          });
          
          return result;
        }catch(err){
            console.log(err);
        }
    }

    async putPause()
    {
        try{
            //Richiesta post
            const result=await axios.put(TOMATOS_API+'/timer/'+this.timers.getId(), {
            "user_id":this.timers.getUserId(),
            "start_date":this.timers.getStartDate(),
            "end_date":this.timers.getEndDate(),
            "status":this.timers.getStatus(),
            "timer_type":this.timers.getTimerType()
          });
          
          return result;
        }catch(err){
            console.log(err);
        }
    }

    async loadSelect()
    {
        try{
            const result=await axios.get(`${TOMATOS_API}/timersTypes`);
            const type=result.data;
            let cont=0;
            for(const t of type)
            {
                if(t.type=="pause")
                {
                    if(cont==0)
                        this.select.innerHTML+='<option value='+t.duration+' data-id='+t.id+' selected>'+t.description+'</option>';
                    else
                        this.select.innerHTML+='<option value='+t.duration+' data-id='+t.id+'>'+t.description+'</option>';
                    cont++;
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    
}