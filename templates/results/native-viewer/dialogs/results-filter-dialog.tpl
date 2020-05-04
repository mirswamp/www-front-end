<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>

	<h1 id="modal-header-text">
		<i class="fa fa-filter"></i>Filter
	</h1>
</div>

<div class="modal-body">
	<p>Include only the following bug types in the results set: </p>

	<div style="max-height:300px; overflow:auto">
		<table>
			<thead>
				<tr>
					<th class="checkboxes">
					</th>

					<th class="bug-type">
						<i class="fa fa-bug"></i>
						<span>Code</span>
					</th>

					<th class="bug-count">
						<i class="fa fa-list"></i>
						<span>Count</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<% for (var i = 0; i < catalog.length; i++) { %>
				<tr>
					<td class="checkboxes">
						<input type="checkbox" id="<%= catalog[i].code %>"<% if (filter_type == 'include'? filter.includes(catalog[i].code) : !filter.includes(catalog[i].code)) { %> checked<% } %>/>
					</td>

					<td class="bug-type">
						<%= htmlEncode(catalog[i].code) %>
					</td>

					<td class="bug-count">
						<span class="badge"><%= catalog[i].count %></span>
					</td>
				</tr>
				<% } %>
			</tbody>
		</table>
	</div>
</div>

<div class="modal-footer">
	<div class="options" style="float:left; padding:5px">
		<input id="all" type="checkbox" style="margin-right:10px"<% if (filter_type != 'include') { %> checked<% } %>/>All
	</div>

	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
</div>