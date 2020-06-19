<div class="items-per-page">
	<input min="1" max="<%= maxItemsPerPage %>" <% if (itemsPerPage > 0) { %>value="<%= itemsPerPage %>"<% } %> size="<%= maxItemsPerPage? maxItemsPerPage.toString().length : 3 %>" />
	items / page
</div>

<% if (numPages > 1) { %>
<div class="btn-group">
	<button type="button" class="first btn btn-sm"<% if (pageNumber <= 1) { %> disabled<% } %>>
		<i class="fa fa-fast-backward"></i>
	</button>

	<button type="button" class="prev btn btn-sm"<% if (pageNumber <= 1) { %> disabled<% } %>>
		<i class="fa fa-backward"></i>
	</button>

	<span class="page-info">
		<input class="page-number" value="<%= pageNumber %>" size="<%= numPages? numPages.toString().length : 1 %>"> / <span id="num-pages"><%= numPages %></span>
	</span>

	<button type="button" class="next btn btn-sm"<% if (pageNumber >= numPages) { %> disabled<% } %>>
		<i class="fa fa-forward"></i>
	</button>

	<button type="button" class="last btn btn-sm"<% if (pageNumber >= numPages) { %> disabled<% } %>>
		<i class="fa fa-fast-forward"></i>
	</button>
</div>
<% } %>