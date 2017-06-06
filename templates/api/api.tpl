<h1><div class="icon"><i class="fa fa-compass"></i></div>API Explorer</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#help"><i class="fa fa-question"></i>Help</a></li>
	<li><i class="fa fa-code"></i>API Explorer</li>
</ol>

<p>The following is a description of the SWAMP application programmer interface.  This <a href="https://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">REST API</a> is composed of a list of "routes" or "web services" that may be called from a web application, a piece of compiled software, a command line script, or any other tool that can make HTTP requests. </p>

<div id="route-filters"></div>
<br />

<% if (editable) { %>
<div class="top buttons">
	<button id="add-new-route" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Route</button>
</div>
<% } %>

<div class="well">
	<label>Base URL:</label><span id="server"><%= Config.servers.web %></span>
</div>

<h2>Routes</h2>
<div id="routes-list"></div>

<h2>Data Types</h2>
<div id="types-list"></div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<% if (showPrivate) { %>
<div class="bottom buttons">
	<button id="view-report" class="btn btn-primary btn-lg"><i class="fa fa-file"></i>View Report</button>
</div>
<% } %>

