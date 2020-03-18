---
layout: main
title: Pummarole
---

<div class="row">
    <div class="col-md-4">
      <h1>Pause</h1>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
        </div>
        <select class="custom-select" id="selectPause">
        </select>
      </div>
      <div id="pauseTimer">00:00</div>
      <button type="button" class="btn btn-success" id="playPause">Play</button>
      <button type="button" class="btn btn-danger" id="brokenPause" >Remove</button>
    </div>
    <div class="col-md-4">
      <h1>Tomato</h1>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
        </div>
        <select class="custom-select" id="selectTomato">
        </select>
      </div>
      <div id="tomatoTimer">00:00</div>
      <button type="button" class="btn btn-success" id="playTomato">Play</button>
      <button type="button" class="btn btn-danger" id="brokenTomato" >Remove</button>
    </div>
    <div class="col-md-4">
      <form>
        <div class="form-group">
          <label>Task title</label>
          <input type="text" class="form-control is-valid" id="tomatoTitle" placeholder="Insert a title..." min="3" max="25" required>
        </div>
        <div class="invalid-feedback">
          Il titolo è obbligato e compreso tra i 3 e i 25 caratteri.
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea class="form-control rounded-0" id="tomatoDescription" rows="10" placeholder="Insert a description..." max="255" required></textarea>
          <div class="invalid-feedback">
          La descrizione è obbligatoria.
          </div>
        </div>
      </form>
    </div>
</div>
