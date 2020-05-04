<thead>
	<tr>
		<th class="package">
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

		<th class="date hidden-xs<% if (!showStatus) { %> last<% } %>">
			<i class="fa fa-calendar"></i>
			<span>Date</span>
		</th>

		<% if (showStatus) { %>
		<th class="status">
			<i class="fa fa-info-circle"></i>
			<span>Status</span>
		</th>
		<% } %>

		<th class="results">
			<i class="fa fa-bug"></i>
			<span>Results</span>
		</th>

		<% if (showDelete) { %>
		<th class="delete hidden-xs"></th>
		<% } %>

		<th style="display: none">
		</th>
	</tr>
</thead>

<tbody>
</tbody>