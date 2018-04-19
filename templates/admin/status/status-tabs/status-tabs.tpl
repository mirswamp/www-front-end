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