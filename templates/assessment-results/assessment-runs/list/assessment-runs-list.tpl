<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="package first">
				<i class="fa fa-gift"></i>
				<span>Package</span>
			</th>

			<th class="tool">
				<i class="fa fa-wrench"></i>
				<span>Tool</span>
			</th>

			<th class="platform">
				<i class="fa fa-bars"></i>
				<span>Platform</span>
			</th>

			<th class="datetime hidden-xs<% if (!showStatus) { %> last<% } %>">
				<i class="fa fa-calendar"></i>
				<span>Date / Time</span>
			</th>

			<% if (showStatus) { %>
			<th class="status last">
				<i class="fa fa-info-circle"></i>
				<span>Status</span>
			</th>
			<% } %>

			<% if (showDelete) { %>
			<th class="append delete hidden-xs"></th>
			<% } %>

			<th style="display: none">
			</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No assessment runs exist.</p>
<% } %>
