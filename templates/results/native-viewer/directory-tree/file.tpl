<div class="<% if (selected) { %>selected <% } %>file" <% if (selectable) { %>style="cursor:pointer"<% } %>>
	<i class="fa fa-file"></i>
	<a href="<%= url %>" target="_blank"><span class="name"><%- name %></span></a>
	<% if (typeof size != "undefined") { %>
	<span class="size"><%- size %> bytes</span>
	<% } %>
	
	<% if (bugCount > 0) { %>
	<span class="badge"><i class="fa fa-bug"></i><%= bugCount.toLocaleString() %></span>
	<% } %>
</div>