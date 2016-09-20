<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
		
			<% if (showCategory) { %>
			<th class="category first">
				<i class="fa fa-caret-square-o-down"></i>
				<span>Category</span>
			</th>
			<% } %>

			<th class="api-method<% if (!showCategory) {%> first<% } %>">
				<i class="fa fa-caret-square-o-right"></i>
				<span>Method</span>
			</th>

			<% if (showServer) { %>
			<th class="api-server">
				<i class="fa fa-caret-square-o-up"></i>
				<span>Server</span>
			</th>
			<% } %>

			<th class="api-route<% if (!showPrivate && !showUnfinished) { %> last<% } %>">
				<i class="fa fa-external-link-square"></i>
				<span>Route</span>
			</th>

			<% if (showUnfinished) { %>
			<th class="unfinished <% if (!showPrivate) { %> last<% } %>">
				<i class="fa fa-exclamation-circle"></i>
				<span>Unfinished</span>
			</th>
			<% } %>

			<% if (showPrivate) { %>
			<th class="private last">
				<i class="fa fa-lock"></i>
				<span>Private</span>
			</th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No api routes.</p>
<% } %>