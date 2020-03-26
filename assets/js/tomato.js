import Timers from "./timer.js";

const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';

export default class Tomato{
    constructor(timers)
    {
        this.title=document.getElementById('tomatoTitle');
        this.description=document.getElementById('tomatoDescription');
        this.timer=new easytimer.Timer();
        this.select=document.getElementById('selectTomato');
        this.timerId=document.getElementById('tomatoTimer');
        this.playBtn=document.getElementById('playTomato');
        this.brokenBtn=document.getElementById('brokenTomato');
        this.timers=timers;

        this.initListener();
        this.loadSelect();
    }

    //Metodi get e set

    getTitle()
    {
        return this.title;
    }

    getDescription()
    {
        return this.description;
    }

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

    setTitle(title)
    {
        this.title=title;
    }

    setDescription(description)
    {
        this.description=description;
    }

    setTimers(timers)
    {
        this.timers=timers;
    }

    initListener()
    {
        //Broken tomato
        this.brokenBtn.addEventListener('click',(e) => {
            this.timer.stop();
            $(this.timerId).html("00:00:00");

            this.timers.setEndDate(moment().add(this.select.value),'minutes');
            this.timers.setStatus('broken');
            this.putTomato();
        });

        //Scorre il tempo del Tomato e vede quando termina
        this.timer.addEventListener('secondsUpdated', (e) => {
            $(this.timerId).html(this.timer.getTimeValues().toString());
          });
        this.timer.addEventListener('targetAchieved', (e) => {
            $(this.timerId.values).html('00:00:00');
            this.timers.setEndDate(moment().add(this.select.value),'minutes');
            this.timers.setStatus('do');
            this.putTomato();
          });
    }

    startTimer(startSeconds)
    {
        this.timer.start({ countdown: true, startValues: { seconds: startSeconds } });
    }

    async playTomato()
    {
        this.timers.setUserId(1);
        this.timers.setStartDate(moment(Date.now()).format());
        this.timers.setEndDate("");
        this.timers.setStatus("doing");
        this.timers.setTimerType($(this.select).find(':selected').attr('data-id'));
        this.timers.setTitle(this.title.value);
        this.timers.setDescription(this.description.value);
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

    async putTomato()
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
                if(t.type=="tomato")
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