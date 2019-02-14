<% if (collection && collection.length > 0) { %>
<table>
	<thead>
		<tr>
			<% if (showNumbering) { %>
			<th class="prepend number"></th>
			<% } %>

			<th class="prepend select-group">
			</th>
			
			<th class="prepend select">
				<div data-toggle="popover" title="Select All" data-content="Click to select or deselect all items." data-placement="top">
					<input type="checkbox" class="select-all" />
				</div>
			</th>

			<th class="package first">
				<i class="fa fa-gift"></i>
				<span class="hidden-xxs">Package</span>
			</th>

			<th class="tool">
				<i class="fa fa-wrench"></i>
				<span class="hidden-xxs">Tool</span>
			</th>

			<th class="platform">
				<i class="fa fa-bars"></i>
				<span class="hidden-xxs">Platform</span>
			</th>

			<% if (showProjects) { %>
			<th class="project">
				<i class="fa fa-folder"></i>
				<span class="hidden-xxs">Project</span>
			</th>
			<% } %>

			<th class="datetime hidden-xs<% if (!showStatus) { %> last<% } %>">
				<i class="fa fa-calendar"></i>
				<span class="hidden-xxs">Date</span>
			</th>

			<% if (showStatus) { %>
			<th class="status">
				<i class="fa fa-stethoscope"></i>
				<span class="hidden-xxs">Status</span>
			</th>
			<% } %>

			<th class="results last">
				<i class="fa fa-bug"></i>
				<span class="hidden-xxs">Results</span>
			</th>

			<% if (showDelete) { %>
			<th class="append delete hidden-xs"></th>
			<% } %>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
<% } else { %>
<p>No assessment runs exist.</p>
<% } %>
