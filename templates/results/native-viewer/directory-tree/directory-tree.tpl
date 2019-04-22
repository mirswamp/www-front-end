<div class="<% if (selected) { %>selected <% } %><% if (root) { %>root <% } %>directory">
	<div class="info" <% if (selectable) { %>style="cursor:pointer"<% } %> >
		
		<% if (checked) { %>
		<i class="expander fa <%= expanderOpenIcon %>"></i>
		<% } else { %>
		<i class="expander fa <%= expanderClosedIcon %>"></i>
		<% } %>

		<% if (checked) { %>
		<i class="icon fa fa-folder-open"></i>
		<% } else { %>
		<i class="icon fa fa-folder"></i>
		<% } %>
		
		<strong><div class="name"><%- name %></div></strong>

		<% if (bugCount > 0) { %>
		<span class="badge"><i class="fa fa-bug"></i><%= bugCount.toLocaleString() %></span>
		<% } %>
	</div>
	<ul class="contents">
	</ul>
</div>
