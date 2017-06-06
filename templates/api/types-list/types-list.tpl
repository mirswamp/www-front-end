<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>
		
			<th class="name first">
				<i class="fa fa-font"></i>
				<span>Name</span>
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
<p>No api types.</p>
<% } %>