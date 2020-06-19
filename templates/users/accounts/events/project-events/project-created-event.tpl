<td class="event">
	<label class="title"><i class="fa fa-folder"></i>Project <%- full_name %> Created</label>
		
	<div class="description">Project <a href="<%- url %>" target="_blank"><%- full_name %></a> was created.</div>
</td>

<td class="date">
	<%= typeof event_date !== 'undefined'? dateToSortableHTML(event_date) : '' %>
</td>