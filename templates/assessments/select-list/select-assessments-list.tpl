<thead>
	<tr>	
		<th class="select-group">
		</th>

		<th class="select">
			<div data-toggle="popover" title="Select All" data-content="Click to select or deselect all items." data-placement="top">
				<input type="checkbox" class="select-all" />
			</div>
		</th>

		<th class="package">
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

		<th class="results">
			<i class="fa fa-check"></i>
			<span class="hidden-xxs">Results</span>
		</th>

		<% if (showDelete) { %>
		<th class="delete hidden-xs"></th>
		<% } %>
	</tr>
</thead>
<tbody>
</tbody>