<h1>
	<div class="icon"><i class="fa fa-plus"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#run-requests/schedules<% queryString? '?' + queryString : '' %>"><i class="fa fa-calendar"></i>Schedules</a></li>
	<li><i class="fa fa-plus"></i><span id="breadcrumb">Add Schedule</span></li>
</ol>

<div id="schedule-profile-form"></div>
<h2>Run Requests</h2>
<div id="schedule-items-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading schedule items...</div>
	</div>
</div>

<div class="bottom buttons">
	<button id="add-request" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Add Request</button>
	<button id="save" class="btn btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>