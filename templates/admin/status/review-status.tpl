<h1><div class="icon"><i class="fa fa-dashboard"></i></div>Review Status</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><i class="fa fa-dashboard"></i>Review Status</li>
</ol>

<div style="float:left">
	<label style="line-height:40px">
		<input type="checkbox" id="auto-refresh" <% if (autoRefresh) { %>checked<% } %>>
		Auto refresh
	</label>
	<button id="refresh" class="btn"<% if (autoRefresh) { %> style="display:none"<% } %>><i class="fa fa-refresh"></i>Refresh</button>
</div>
<div style="clear:both"></div>

<h2>Summary</h2>
<div id="run-queue-summary"></div>

<h2>Details</h2>
<div id="details"></div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="kill-runs" class="btn btn-primary btn-lg" style="display:none" disabled><i class="fa fa-times"></i>Kill Execution Runs</button>

	<button id="kill-viewers" class="btn btn-primary btn-lg" style="display:none" disabled><i class="fa fa-times"></i>Kill Viewer Runs</button>

	<button id="shutdown-viewers" class="btn btn-lg" style="display:none" disabled><i class="fa fa-times"></i>Shutdown Viewer Runs</button>
</div>
