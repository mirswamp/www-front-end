<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% if (showCategory) { %>
<td class="category first">
	<%= category? category.capitalize() : '' %>
</td>
<% } %>

<td class="api-method<% if (!showCategory) {%> first<% } %>">
	<span class="<%= method? method.toLowerCase() : undefined %> method"><%= method %></span>
</td>

<% if (showServer) { %>
<td class="api-server">
	<span class="<%= server %>"><%= server %></span>
</td>
<% } %>

<td class="api-route<% if (!showPrivate && !showUnfinished) { %> last<% } %>">
	<% if (url) { %>
	<a href="<%= url %>"><span class="code route"><%= route.replace(/\//g, '<wbr>/<wbr>') %></span></a>
	<% } else { %>
	<span class="code route"><%= route.replace(/\//g, '<wbr>/<wbr>') %></span>
	<% } %>
</td>

<% if (showUnfinished) { %>
<td class="unfinished <% if (!showPrivate) { %> last<% } %>">
	<% if (!description || description == '') { %>
	<span class="warning">&#x2713;</span>
	<% } %>
</td>
<% } %>

<% if (showPrivate) { %>
<td class="private last">
<% if (editable) { %>
	<input type="checkbox" class="private" <% if (private) {%>checked<% } %>>
<% } else { %>
<% if (private) { %>
	<span class="success">&#x2713;</span>
<% } %>
<% } %>
</td>
<% } %>


