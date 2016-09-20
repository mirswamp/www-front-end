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

			<th class="results last">
				<i class="fa fa-bug"></i>
				<span>Results</span>
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
<p>No assessments have been defined.</p>
<% } %>