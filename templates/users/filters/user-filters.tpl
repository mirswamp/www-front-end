<div class="filters panel-group" id="filters-accordion">
	<div class="panel">
		<div class="panel-heading">
			<label>
				<i class="fa fa-filter" ></i>
				Filters
			</label>
			<span id="filter-controls"></span>
			<span class="tag" id="reset-filters"><i class="fa fa-remove"></i></span>
		</div>
		<div id="filters-info" class="nested panel-collapse collapse in">
			<div class="filters panel-group">
				<div id="user-type-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['user-type-filter']) { %>in <% } %>collapse" />
				<div id="date-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['date-filter']) { %>in <% } %>collapse" />
				<div id="last-login-date-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['login-date-filter']) { %>in <% } %>collapse" />
				<div id="limit-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['limit-filter']) { %>in <% } %>collapse" />
			</div>
		</div>
	</div>
</div>
