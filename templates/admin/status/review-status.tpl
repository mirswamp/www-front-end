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
<ul class="nav nav-tabs">
	<% for (var i = 0; i < tabs.length; i++) { %>
	<% var tab = tabs[i]; %>
	<% var id = (tab.replace(/ /g, '_').toLowerCase()); %>
	<li id="<%= id %>-tab"<%if (activeTab == tab || !activeTab && i == 0) { %> class="active" <% } %>>
		<a role="tab" data-toggle="tab" href="#<%= id %>-panel"><i class="fa fa-list"></i><span><%= tab %></span></a>
	</li>
	<% } %>
</ul>

<div class="tab-content">
	<% for (var i = 0; i < tabs.length; i++) { %>
	<% var tab = tabs[i]; %>
	<% var id = (tab.replace(/ /g, '_').toLowerCase()); %>
	<div id="<%= id %>-panel" role="tabpanel" class="tab-pane<% if (activeTab == tab || !activeTab && i == 0) { %> active<% } %>">
		<div id="<%= id %>">
			<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading...</div> 
		</div>
	</div>
	<% } %>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="kill-runs" class="btn btn-primary btn-lg"><i class="fa fa-times"></i>Kill Execution Runs</button>
</div>
