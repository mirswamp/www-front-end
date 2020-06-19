<td class="event">
	<label class="title"><i class="fa fa-folder-o"></i>Project <%- full_name %> Rejected</label>

	<div class="description">Project <a href="<%- url %>" target="_blank"><%- full_name %></a> was rejected by a SWAMP administrator.</div>
</td>

<td class="date">
	<%= typeof event_date !== 'undefined'? dateToSortableHTML(event_date) : '' %>
</td>