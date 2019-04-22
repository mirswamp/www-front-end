<thead>
	<tr class="titles">
		<% if (showNumbering) { %>
		<th class="prepend number"></th>
		<% } %>

		<% if (typeof BugLocations != 'undefined') { %>
		<th class="file first">
			<i class="fa fa-file"></i>
			<span>File</span>
		</th>
		<% } %>

		<% if (typeof BugLocations != 'undefined') { %>
		<th class="line-number">
			<i class="fa fa-list"></i>
			<span>Row</span>
		</th>
		<% } %>

		<% if (typeof BugLocations != 'undefined') { %>
		<th class="column-number">
			<i class="fa fa-columns"></i>
			<span>Col</span>
		</th>
		<% } %>

		<% if (typeof BugSeverity != 'undefined') { %>
		<th class="group">
			<i class="fa fa-exclamation"></i>
			<span>Severity</span>
		</th>
		<% } %>

		<% if (typeof BugGroup != 'undefined') { %>
		<th class="group">
			<i class="fa fa-object-group"></i>
			<span>Group</span>
		</th>
		<% } %>

		<% if (typeof BugCode != 'undefined') { %>
		<th class="code last">
			<i class="fa fa-bug"></i>
			<span>Code</span>
		</th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>