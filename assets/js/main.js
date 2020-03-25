import Tomato from "./tomato.js";
import Timers from "./timer.js";
import Pause from "./pause.js";

const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';

class Main
{
    constructor()
    {
        this.playTomato=this.playBtn=document.getElementById('playTomato');
        this.brokenTomato=document.getElementById('brokenTomato');
        this.playPause=this.playBtn=document.getElementById('playPause');
        this.brokenPause=document.getElementById('brokenPause');

        this.loadTimers();
    }

    initListener()
    {
        //Controllo chiusura pagina
        window.addEventListener('beforeunload', (event) => {
            event.returnValue = 'Sei sicuro di voler chiudere la pagina? Le modifiche potrebbero non essere apportate.';
          });

      /*  window.addEventListener("load",(e)=>{
            this.loadTimers();
        }); */

        //Play tomato
        document.getElementById('playTomato').addEventListener('click',(e) => {
            this.tomatoForm=document.getElementById('tomatoForm');
            if(!this.tomatoForm.checkValidity())
            {
                return;
            }
            else
            {
                this.tomato.playTomato();
                this.tomato.startTimer(60*this.tomato.getSelect().value);
                this.controllBtn();
            }
        });

        //Play pause
        document.getElementById('playPause').addEventListener('click',(e) => {
            this.pause.playPause();
            this.pause.startTimer(60*this.pause.getSelect().value);
            this.controllBtn();
        });

        //Broken pause
        this.pause.getBrokenBtn().addEventListener('click',(e) => {
            this.pause.getTimer().stop();
            $(this.pause.getTimerId()).html("00:00:00");

            this.timers.setEndDate(moment());
            this.timers.setStatus('broken');
            this.controllBtn();
            this.pause.putPause();
        });

        //Scorre il tempo della pausa e vede quando termina
        this.pause.getTimer().addEventListener('secondsUpdated', (e) => {
            $(this.pause.getTimerId()).html(this.pause.getTimer().getTimeValues().toString());
          });
        this.pause.getTimer().addEventListener('targetAchieved', (e) => {
            $(this.pause.getTimerId().values).html('00:00:00');
            this.pause.getTimers().setEndDate(moment().add(this.pause.getSelect().value),'minutes');
            this.pause.getTimers().setStatus('do');
            this.controllBtn();
            this.pause.putPause();
          });

        //Broken tomato
        this.tomato.getBrokenBtn().addEventListener('click',(e) => {
            this.tomato.getTimer().stop();
            $(this.tomato.getTimerId()).html("00:00:00");

            this.timers.setEndDate(moment());
            this.timers.setStatus('broken');
            this.controllBtn();
            this.tomato.putTomato();
        });

        //Scorre il tempo del tomato e vede quando termina
        this.tomato.getTimer().addEventListener('secondsUpdated', (e) => {
            $(this.tomato.getTimerId()).html(this.tomato.getTimer().getTimeValues().toString());
          });
        this.tomato.getTimer().addEventListener('targetAchieved', (e) => {
            $(this.tomato.getTimerId().values).html('00:00:00');
            this.tomato.getTimers().setEndDate(moment().add(this.tomato.getSelect().value),'minutes');
            this.tomato.getTimers().setStatus('done');
            this.controllBtn();
            this.tomato.putTomato();
          });
    }

    async loadTimers()
    {
        try{
            //await this.tomato.loadSelect(); //Idem per la pausa
            const result=await axios.get(`${TOMATOS_API}/timer/${1}`);
            const t=result.data;
            this.timers=await new Timers(t[0].id,t[0].user_id,t[0].start_date,t[0].end_date,t[0].status,t[0].timer_type,t[0].type,t[0].title,t[0].description,t[0].duration,t[0].first_cycle);
            this.tomato=await new Tomato(this.timers);
            this.pause=await new Pause(this.timers);
            const listener=await this.initListener();
            console.log(t);
            const load=await this.timerInLoad();
            const button=await this.controllBtn();
        }
        catch(err)
        {
            console.log(err);
        }
    }

    async timerInLoad()
    {
        let startDate=moment(this.timers.getStartDate());
        let diffDate=moment().diff(this.timers.getStartDate(),'minutes');
        console.log(diffDate);
        console.log(this.timers.getDuration());
            if(this.timers.getStatus()=='doing'&&diffDate<this.timers.getDuration()) //Se un timer è in corso
            {
                const diffDateSeconds=(this.timers.getDuration()*60)-moment().diff(this.timers.getStartDate(),'seconds');
                if(this.timers.type=='tomato')
                {
                    this.tomato.startTimer(diffDateSeconds);
                    this.controllBtn();
                }
                else if(this.timers.type=='pause')
                {
                    this.pause.startTimer(diffDateSeconds);
                    this.controllBtn();
                }
            }
            else if(this.timers.getStatus()=='doing'&&diffDate>=this.timers.getDuration()) //Se un timer è terminato
            {
                this.timers.setStatus("done");
                let datePlus=moment(startDate).add(this.timers.getDuration(),'minutes').format();
                this.timers.setEndDate(datePlus);
                console.log("Data"+datePlus);
                if(this.timers.getType()=='tomato')
                    this.tomato.putTomato();
                else if(this.timers.getType()=='pause')
                    this.pause.putPause();
            }
    }

    controllBtn()
    {
        if(this.tomato.getTimer().isRunning()) //Se c'è in corso un tomato il suo play sarà disabilitato e tutti i pulsanti della pausa
        {
            this.tomato.getPlayBtn().setAttribute("disabled","");
            this.tomato.getBrokenBtn().removeAttribute("disabled");
            this.pause.getPlayBtn().setAttribute("disabled","");
            this.pause.getBrokenBtn().setAttribute("disabled","");
        }
        else if(this.pause.getTimer().isRunning())
        {
            this.pause.getPlayBtn().setAttribute("disabled","");
            this.pause.getBrokenBtn().removeAttribute("disabled");
            this.tomato.getPlayBtn().setAttribute("disabled","");
            this.tomato.getBrokenBtn().setAttribute("disabled","");
        }
        else
        {
            console.log("Qui");
            this.pause.getPlayBtn().removeAttribute("disabled");
            this.pause.getBrokenBtn().setAttribute("disabled","");
            this.tomato.getPlayBtn().removeAttribute("disabled");
            this.tomato.getBrokenBtn().setAttribute("disabled","");
        }
    }
}

export default new Main();