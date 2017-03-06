<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr class="titles">
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<% if (false) { %>
			<th class="package first">
				<i class="fa fa-gift"></i>
				<span class="hidden-xxs">Package</span>
			</th>
			<% } %>

			<th class="platform">
				<i class="fa fa-bars"></i>
				<span class="hidden-xxs">Platform</span>
			</th>
			
			<th class="platform-version">
				<i class="fa fa-list-ol"></i>
				<span class="hidden-xxs">Platform Version</span>
			</th>

			<th class="compatible last">
				<i class="fa fa-handshake-o"></i>
				<span class="hidden-xxs">Compatible</span>
			</th>

			<% if (showDelete) { %>
			<th class="append"></th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No package platforms have been defined.</p>
<% } %>