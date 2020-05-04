<h1>
	<div class="icon"><i class="fa fa-calendar"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-calendar"></i><span id="breadcrumb">Schedules</span></li>
</ol>

<p>Schedules are used to define recurring intervals upon which assessments are repeatedly run. </p>

<div id="schedule-filters"></div>

<div class="top buttons">
	<button id="add-new-schedule" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Schedule</button>
</div>

<div id="schedules-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading schedules...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<label>
	<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
	Show grouping
</label>