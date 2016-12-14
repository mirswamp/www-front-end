<div class="accordion-inner" id="<%= id %>">
	<i class="fa fa-minus-circle close accordion-toggle" data-toggle="collapse" href="#date-filter" />

	<h3><i class="fa <%= icon %>"></i><%= title %></h3>

	<div class="row">
		<div class="form-group controls">
			<label class="control-label">After</label>
			<input class="form-control" id="after-date" type="date" <% if (afterDate) { %> value="<%- afterDate %>"<% } %> />
		</div>

		<div class="form-group controls">
			<label class="control-label">Before</label>
			<input class="form-control" id="before-date" type="date"<% if (beforeDate) { %> value="<%- beforeDate %>"<% } %> />
		</div>
	</div>

	<div class="buttons row" align="right">
		<button id="reset" class="btn btn-sm"><i class="fa fa-times"></i>Reset</button>
	</div>
</div>
