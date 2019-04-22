<div id="items-per-page" style="float:left; margin-top:5px">
	<input <% if (itemsPerPage > 0) { %>value="<%= itemsPerPage %>"<% } %> style="width:30px; height:25px; margin-top:-5px">
	items / page
</div>


<% if (numPages > 1) { %>
<div class="btn-group" style="margin-left:50px">
	<button type="button" class="btn btn-sm" id="first"<% if (pageNumber <= 1) { %> disabled<% } %>>
		<i class="fa fa-fast-backward"></i>
	</button>

	<button type="button" class="btn btn-sm" id="prev"<% if (pageNumber <= 1) { %> disabled<% } %>>
		<i class="fa fa-backward"></i>
	</button>

	<span class="page-info" style="display:inline-block; float:left; padding:4px; border:none">
		<input id="page-number" value="<%= pageNumber %>" style="width:25px; height:25px; margin-top:-5px"> /
		<span id="num-pages"><%= numPages %></span>
	</span>

	<button type="button" class="btn btn-sm" id="next"<% if (pageNumber >= numPages) { %> disabled<% } %>>
		<i class="fa fa-forward"></i>
	</button>

	<button type="button" class="btn btn-sm" id="last"<% if (pageNumber >= numPages) { %> disabled<% } %>>
		<i class="fa fa-fast-forward"></i>
	</button>
</div>
<% } %>