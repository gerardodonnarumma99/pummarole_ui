export default class Timers
{
    constructor(id,user_id,start_date,end_date,status,timer_type,type,title,description,duration,firstCycle)
    {
        this.id=id;
        this.userId=user_id;
        this.startDate=start_date;
        this.endDate=end_date;
        this.status=status;
        this.timerType=timer_type;
        this.type=type;
        this.duration=duration;
        this.title=title;
        this.description=description;
        this.firstCycle=firstCycle;
    }

    getId()
    {
        return this.id;
    }

    getUserId()
    {
        return this.userId;
    }

    getStartDate()
    {
         return this.startDate;
    }

    getEndDate()
    {
        return this.endDate;
    }

    getStatus()
    {
        return this.status;
    }

    getTimerType()
    {
        return this.timerType;
    }

    getType()
    {
        return this.type;
    }

    getDuration()
    {
        return this.duration;
    }

    getTitle()
    {
        return this.title;
    }

    getDescription()
    {
        return this.description;
    }

    getFirstCycle()
    {
        return this.firstCycle;
    }

    setFirstCycle(firstCycle)
    {
        this.firstCycle=firstCycle;
    }

    setId(id)
    {
        this.id=id;
    }

    setUserId(userId)
    {
        this.userId=userId;
    }

    setStartDate(startDate)
    {
         this.startDate=startDate;
    }

    setEndDate(endDate)
    {
        this.endDate=endDate;
    }

    setStatus(status)
    {
        this.status=status;
    }

    setTimerType(timerType)
    {
        this.timerType=timerType;
    }

    setType(type)
    {
        this.type=type;
    }

    setDuration(duration)
    {
        this.duration=duration;
    }

    setTitle(title)
    {
        this.title=title;
    }

    setDescription(description)
    {
        this.description=description;
    }
}