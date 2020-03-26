---
layout: main
title: Pummarole
---
<div id="nextTimer" style="position: absolute; margin-left: 1000px" value="">Next:</div>
<div class="row">
    <div class="col-md-4">
      <h1>Pause</h1>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
        </div>
        <select class="custom-select" id="selectPause">
        </select>
      </div>
      <div id="pauseTimer">00:00:00</div>
      <button type="button" class="btn btn-success" id="playPause" ><span class="fas fa-play" id="iconPause" hidden></span> Play</button>
      <button type="button" class="btn btn-danger" id="brokenPause" disabled>Remove</button>
    </div>
    <div class="col-md-4">
      <h1>Tomato</h1>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
        </div>
        <select class="custom-select" id="selectTomato">
        </select>
      </div>
      <div id="tomatoTimer">00:00:00</div>
      <button type="submit" class="btn btn-success" id="playTomato"><span class="fas fa-play" id="iconTomato" hidden></span> Play</button>
      <button type="button" class="btn btn-danger" id="brokenTomato" disabled>Remove</button>
    </div>
    <div class="col-md-4">
    <h1>Task Tomato</h1>
      <form id="tomatoForm">
        <div class="form-group">
          <label id="taskTitle">Title</label>
          <input type="text" class="form-control" id="tomatoTitle" placeholder="Insert a title..." min="3" max="25" title="Il titolo è obbligatio e compreso tra i 3 e i 25 caratteri." required>
        </div>
        <div class="form-group">
          <label id="taskDescription">Description</label>
          <textarea class="form-control rounded-0" id="tomatoDescription" rows="10" placeholder="Insert a description..." max="255" required></textarea>
        </div>
        <button class="btn btn-primary" type="button" id="resetCycle">Avvia un nuovo ciclo</button>
      </form>
    </div>
</div>

<div class="row" style="padding: 20px">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Start</th>
            <th scope="col">Duration</th>
            <th scope="col">Status</th>
            <th scope="col">Task title</th>
            <th scope="col">Task description</th>
          </tr>
        </thead>
        <tbody id="tableLastEvent">
        </tbody>
      </table>
    </div>
