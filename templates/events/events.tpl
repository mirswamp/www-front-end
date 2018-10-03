<h1>
	<div class="icon"><i class="fa fa-bullhorn"></i></div>
	<% if (model) { %>
	<% if (model.isTrialProject()) { %>
	Events
	<% } else { %>
	Project <span class="name"><%- model.get('full_name') %></span> Events
	<% } %>
	<% } else { %>
	All Events
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>

	<% if (model) { %>
	<% if (model.isTrialProject()) { %>
	<li><i class="fa fa-bullhorn"></i>Events</li>
	<% } else { %>
	<li><i class="fa fa-bullhorn"></i><%- model.get('full_name') %> Events</li>
	<% } %>
	<% } else { %>
	<li><i class="fa fa-bullhorn"></i>All Events</li>
	<% } %>
</ol>

<p>Significant events pertaining to user accounts and projects are logged for future reference. Below are listed events pertaining to your user account and projects. </p>

<div id="event-filters"></div>
<br />

<div id="events-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading events...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>