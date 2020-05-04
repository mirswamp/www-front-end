<thead>
	<tr>
		<% if (typeof BugLocations !== 'undefined') { %>
		<th class="file">
			<i class="fa fa-file"></i>
			<span>File</span>
		</th>
		<% } %>

		<% if (typeof BugLocations !== 'undefined') { %>
		<th class="line">
			<i class="fa fa-bars"></i>
			<span>Line</span>
		</th>
		<% } %>

		<% if (typeof BugLocations !== 'undefined') { %>
		<th class="column">
			<i class="fa fa-ellipsis-h"></i>
			<span>Col</span>
		</th>
		<% } %>

		<% if (typeof BugSeverity !== 'undefined') { %>
		<th class="group">
			<i class="fa fa-exclamation"></i>
			<span>Severity</span>
		</th>
		<% } %>

		<% if (typeof BugGroup !== 'undefined') { %>
		<th class="group">
			<i class="fa fa-object-group"></i>
			<span>Group</span>
		</th>
		<% } %>

		<% if (typeof BugCode !== 'undefined') { %>
		<th class="code">
			<i class="fa fa-bug"></i>
			<span>Code</span>
		</th>
		<% } %>
	</tr>
</thead>

<tbody>
</tbody>