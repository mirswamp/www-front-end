<% if (showNumbering) { %>
<td class="prepend number"><%= index %></td>
<% } %>

<td class="event">
	<label class="title"><i class="fa fa-user"></i><i class="fa fa-folder"></i>User Left Project <span class="project-short-name"></span></label>

	<div class="description">
	<% if (user) { %><% if (user.has('email')) { %><a class="user-name" href="mailto:<%- user.get('email') %>"><%- user.getFullName() %></a><% } else { %><%= user.getFullName() %><% } %><% } else { %>User<% } %> left project <a href="<%- projectUrl %>"><span class="project-full-name"></span></a>.
	</div>
</div>

<td class="date">
	<%= date? date.format() : '' %>
</td>